import React from 'react';
import { Button, ButtonProps, Stack, Divider, Typography } from '@mui/material';
import { styled, Theme, SxProps } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin, TokenResponse } from '@react-oauth/google';
import GoogleIcon from '@mui/icons-material/Google';
import KakaoTalkIcon from '../../assets/icons/KakaoTalk';

const commonSocialButtonStyles = (theme: Theme): SxProps<Theme> => ({
  width: '100%',
  height: '45px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  marginBottom: theme.spacing(1),
  gap: theme.spacing(1),
  textTransform: 'none',
  cursor: 'pointer',
  borderRadius: '12px',
  fontSize: '15px',
  border: '1px solid transparent',
  boxShadow: 'none',

  transition: theme.transitions.create(
    ['background-color', 'box-shadow', 'border-color', 'color'],
    { duration: theme.transitions.duration.short }
  ),

  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(0.5),
    display: 'flex',
    alignItems: 'center',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '24px',
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
    boxShadow: 'none',
  },
});

const KakaoButton = styled(Button)<ButtonProps>(({ theme }) => ({
  ...(commonSocialButtonStyles(theme) as object),
  backgroundColor: '#FEE500',
  color: '#000000',
  '&:hover': {
    backgroundColor: '#FDD835',
    boxShadow: 'none',
  },
  '& .MuiSvgIcon-root': {
    color: '#000000',
  },
}));

const GoogleCustomButton = styled(Button)<ButtonProps>(({ theme }) => ({
  ...(commonSocialButtonStyles(theme) as object),
  backgroundColor: '#ffffff',
  color: '#424242',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: '#f8f9fa',
    borderColor: theme.palette.divider,
    boxShadow: 'none',
  },
  '& .MuiSvgIcon-root': {
    color: 'inherit',
  },
}));

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
  flowIntent: 'login' | 'signup' | 'link';
}

const SocialLogin: React.FC<SocialLoginProps> = ({ onSuccess, onError, disabled, flowIntent }) => {
  const { socialLogin } = useAuth();
  const navigate = useNavigate();
  const [userMessage, setUserMessage] = React.useState<string | null>(null);

  const handleSocialLoginFlowEnd = (isNewUser: boolean | undefined) => {
    if (isNewUser) {
      navigate('/social-onboarding');
    } else {
      if (onSuccess) onSuccess();
      else navigate('/');
    }
  };

  const processSocialLoginResult = (
    result: { success: boolean; isNewUser?: boolean; errorCode?: string; message?: string, tempKakaoProfile?: any },
    providerName: string
  ) => {
    if (result.success) {
      if (flowIntent === 'link') {
        setUserMessage(result.message || `${providerName} 계정이 성공적으로 연결되었습니다.`);
        if (onSuccess) onSuccess();
      } else {
        handleSocialLoginFlowEnd(result.isNewUser);
      }
    } else {
      if (flowIntent === 'link') {
        if (result.errorCode === 'NOT_AUTHENTICATED_FOR_LINK') {
          setUserMessage(result.message || '계정 연동을 위해서는 먼저 로그인이 필요합니다.');
        } else if (result.errorCode === 'LOGGED_IN_USER_NOT_FOUND') {
          setUserMessage(result.message || '로그인된 사용자 정보를 찾을 수 없어 연동에 실패했습니다.');
        } else if (result.errorCode === 'SOCIAL_ACCOUNT_ALREADY_LINKED_TO_DIFFERENT_USER') {
          setUserMessage(result.message || `이 ${providerName} 계정은 이미 다른 사용자와 연결되어 있습니다.`);
        } else {
          setUserMessage(result.message || `${providerName} 계정 연동에 실패했습니다. (오류 코드: ${result.errorCode || 'UNKNOWN'})`);
        }
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
      }
      if (onError) onError({ errorCode: result.errorCode, message: result.message });
    }
  };

  const handleGoogleTokenResponse = async (tokenResponse: Omit<TokenResponse, 'error' | 'error_description' | 'error_uri'>) => {
    setUserMessage(null);
    try {
      const result = await socialLogin('google', tokenResponse.access_token, flowIntent);
      processSocialLoginResult(result, 'Google');

    } catch (error: any) {
      console.error('Google login processing failed:', error);
      setUserMessage(error.message || 'Google 로그인 처리 중 오류가 발생했습니다.');
      if (onError) onError(error);
    }
  };

  const googleLoginHook = useGoogleLogin({
    onSuccess: handleGoogleTokenResponse,
    onError: () => {
      console.error('Google login failed (useGoogleLogin hook error).');
      setUserMessage('Google 로그인 과정에서 오류가 발생했습니다.');
      if (onError) {
        onError(new Error('Google login process failed (useGoogleLogin hook error).'));
      }
    },
  });

  const handleKakaoLogin = async () => {
    setUserMessage(null);
    if (disabled) return;
    try {
      const { Kakao } = window as any;
      if (!Kakao || !Kakao.Auth) {
        throw new Error('Kakao SDK not loaded or initialized.');
      }
      
      const kakaoAuthResponse: KakaoAuthResponse = await new Promise((resolve, reject) => {
        Kakao.Auth.login({
          success: (response: KakaoAuthResponse) => resolve(response),
          fail: (error: any) => reject(new Error(error.message || JSON.stringify(error))),
          scope: 'profile_nickname,profile_image,account_email',
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
      
      <GoogleCustomButton
        startIcon={<GoogleIcon />}
        onClick={() => googleLoginHook()}
        disabled={disabled}
      >
        Google 계정으로 계속하기
      </GoogleCustomButton>
      
      <KakaoButton 
        startIcon={<KakaoTalkIcon />} 
        onClick={handleKakaoLogin}
        disabled={disabled}
      >
        카카오로 계속하기
      </KakaoButton>

      <DividerWithText>
        <Typography variant="body2">OR</Typography>
      </DividerWithText>
    </Stack>
  );
};

export default SocialLogin; 