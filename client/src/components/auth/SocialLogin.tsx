import React from 'react';
import { Button, Stack, Divider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

// Import logos for social login buttons
// import GoogleIcon from '@mui/icons-material/Google'; // GoogleLogin provides its own button
import KakaoTalkIcon from '../../assets/icons/KakaoTalk'; 

const SocialButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center', // Centering content for the Kakao button
  gap: theme.spacing(1), // Adjusted gap for Kakao button
  textTransform: 'none',
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(1), // Adjusted margin for Kakao icon
  },
}));

// const GoogleButton = styled(SocialButton)({
//   backgroundColor: '#ffffff',
//   color: '#757575',
//   border: '1px solid #dadce0',
//   '&:hover': {
//     backgroundColor: '#f8f9fa',
//     borderColor: '#dadce0',
//   },
// });

const KakaoButton = styled(SocialButton)({
  backgroundColor: '#FEE500',
  color: '#000000',
  '&:hover': {
    backgroundColor: '#FDD835', // Slightly darker yellow on hover
  },
});

const DividerWithText = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  display: 'flex',
  alignItems: 'center',
  '&::before, &::after': {
    content: '""',
    flex: 1,
  },
  '& .MuiTypography-root': {
    padding: theme.spacing(0, 2),
    color: theme.palette.text.secondary,
  },
}));

// Kakao Auth Response type
interface KakaoAuthResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  refresh_token_expires_in: number;
}

interface SocialLoginProps {
  onSuccess?: () => void;
  onError?: (error: Error | { errorCode?: string; message?: string }) => void;
  disabled?: boolean;
  flowIntent: 'login' | 'signup';
}

const SocialLogin: React.FC<SocialLoginProps> = ({ onSuccess, onError, disabled, flowIntent }) => {
  const { socialLogin } = useAuth();
  const navigate = useNavigate();
  const [userMessage, setUserMessage] = React.useState<string | null>(null);

  // This function handles navigation after a successful login/signup or linking.
  const handleSocialLoginFlowEnd = (isNewUser: boolean | undefined) => {
    if (isNewUser) {
      navigate('/social-onboarding');
    } else {
      if (onSuccess) onSuccess(); // Call onSuccess if provided (e.g., to close a modal)
      else navigate('/'); // Else, navigate to home for existing users
    }
  };

  const processSocialLoginResult = (
    result: { success: boolean; isNewUser?: boolean; errorCode?: string; message?: string, tempKakaoProfile?: any },
    providerName: string // For error messages
  ) => {
    if (result.success) {
      handleSocialLoginFlowEnd(result.isNewUser);
    } else {
      if (result.errorCode === 'ACCOUNT_NOT_FOUND_NO_EMAIL' && providerName.toLowerCase() === 'kakao') {
        if (result.tempKakaoProfile) {
          navigate('/social-email-request', { 
            state: { 
              tempKakaoProfile: result.tempKakaoProfile,
              provider: 'kakao' 
            }
          });
        } else {
          setUserMessage(result.message || `카카오 계정에 연결된 이메일 정보가 없습니다. 이메일 입력 페이지로 이동할 수 없습니다.`);
        }
      } else if (result.errorCode === 'ACCOUNT_NOT_FOUND') {
        setUserMessage(result.message || `해당 ${providerName} 계정을 찾을 수 없습니다. 먼저 회원가입을 진행해주세요.`);
      } else if (result.errorCode === 'EMAIL_ALREADY_EXISTS') {
        setUserMessage(result.message || `이미 가입된 이메일입니다. 해당 이메일로 로그인해주세요.`);
      } else if (result.errorCode === 'EMAIL_ACCOUNT_EXISTS_NEEDS_MANUAL_LINK') {
        setUserMessage(result.message || `이미 해당 이메일 주소로 가입된 계정이 있습니다. 기존 계정으로 로그인 후 ${providerName} 계정을 연결하거나, 다른 ${providerName} 계정을 사용해주세요.`);
      } else if (result.errorCode === 'ACCOUNT_LINKED_TO_DIFFERENT_SOCIAL') {
        setUserMessage(result.message || `해당 이메일은 이미 다른 ${providerName} 계정과 연결되어 있습니다.`);
      } else if (result.errorCode === 'INVALID_KAKAO_TOKEN' || result.errorCode === 'INVALID_GOOGLE_TOKEN') {
        setUserMessage(result.message || `유효하지 않거나 만료된 ${providerName} 토큰입니다. 다시 시도해주세요.`);
      } else {
        setUserMessage(result.message || `${providerName} 로그인에 실패했습니다. (오류 코드: ${result.errorCode || 'UNKNOWN'})`);
      }
      if (onError) onError({ errorCode: result.errorCode, message: result.message });
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    setUserMessage(null);
    try {
      if (credentialResponse.credential) {
        const idToken = credentialResponse.credential;
        const result = await socialLogin('google', idToken, flowIntent);
        processSocialLoginResult(result, 'Google');
      } else {
        throw new Error('Google login failed: No credential returned.');
      }
    } catch (error: any) {
      console.error('Google login processing failed:', error);
      setUserMessage(error.message || 'Google 로그인 처리 중 오류가 발생했습니다.');
      if (onError) onError(error);
    }
  };

  const handleGoogleLoginError = () => {
    console.error('Google login failed (GSI library error).');
    setUserMessage('Google 로그인 과정에서 오류가 발생했습니다.');
    if (onError) {
      onError(new Error('Google login process failed (GSI library error).'));
    }
  };

  const handleKakaoLogin = async () => {
    setUserMessage(null);
    if (disabled) return; // Prevent action if disabled
    try {
      const { Kakao } = window as any;
      if (!Kakao || !Kakao.Auth) {
        throw new Error('Kakao SDK not loaded or initialized.');
      }
      
      const kakaoAuthResponse: KakaoAuthResponse = await new Promise((resolve, reject) => {
        Kakao.Auth.login({
          success: (response: KakaoAuthResponse) => resolve(response),
          fail: (error: any) => reject(new Error(error.message || JSON.stringify(error))),
          scope: 'profile_nickname,profile_image,account_email', // Requesting email permission
        });
      });

      const result = await socialLogin('kakao', kakaoAuthResponse.access_token, flowIntent);
      processSocialLoginResult(result, 'Kakao');

    } catch (error: any) {
      console.error('Kakao login failed:', error);
      setUserMessage(error.message || '카카오 로그인 처리 중 오류가 발생했습니다.');
      if (onError) onError(error as Error);
    }
  };

  return (
    <Stack spacing={1.5} sx={{ width: '100%' }}>
      {userMessage && (
        <Typography color="error" variant="body2" sx={{ textAlign: 'center', mb: 1 }}>
          {userMessage}
        </Typography>
      )}
      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={handleGoogleLoginError}
        useOneTap={false}
        shape="rectangular"
        theme="outline"
        size="large"
        // Not passing disabled directly as it's not a supported prop for GoogleLogin
        // If needed, wrap GoogleLogin and conditionally render based on 'disabled' prop
      />
      
      <KakaoButton
        variant="contained"
        startIcon={<KakaoTalkIcon />}
        onClick={handleKakaoLogin}
        disabled={disabled} // Standard MUI button prop
      >
        카카오로 계속하기 {/* Changed text to Kakao */} 
      </KakaoButton>

      <DividerWithText>
        <Typography variant="body2">OR</Typography>
      </DividerWithText>
    </Stack>
  );
};

export default SocialLogin; 