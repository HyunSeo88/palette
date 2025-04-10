import React from 'react';
import { Button, Stack, Divider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Import logos for social login buttons
import GoogleIcon from '@mui/icons-material/Google';
import KakaoTalkIcon from '../../assets/icons/KakaoTalk'; // You'll need to create this icon

const SocialButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  display: 'flex',
  justifyContent: 'flex-start',
  gap: theme.spacing(2),
  textTransform: 'none',
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(2),
  },
}));

const GoogleButton = styled(SocialButton)({
  backgroundColor: '#ffffff',
  color: '#757575',
  border: '1px solid #dadce0',
  '&:hover': {
    backgroundColor: '#f8f9fa',
    borderColor: '#dadce0',
  },
});

const KakaoButton = styled(SocialButton)({
  backgroundColor: '#FEE500',
  color: '#000000',
  '&:hover': {
    backgroundColor: '#FEE500',
    opacity: 0.9,
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
  onError?: (error: Error) => void;
  disabled?: boolean;
}

const SocialLogin: React.FC<SocialLoginProps> = ({ onSuccess, onError, disabled }) => {
  const { socialLogin } = useAuth();
  const navigate = useNavigate();

  const handleSocialLoginSuccess = async (isNewUser: boolean) => {
    if (isNewUser) {
      navigate('/onboarding');
    } else {
      navigate('/');
    }
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Initialize Google OAuth client
      const auth2 = await (window as any).gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();
      const token = googleUser.getAuthResponse().id_token;

      // Send token to backend
      const isNewUser = await socialLogin('google', token);
      await handleSocialLoginSuccess(isNewUser);
    } catch (error) {
      console.error('Google login failed:', error);
      if (onError) {
        onError(error as Error);
      }
    }
  };

  const handleKakaoLogin = async () => {
    try {
      // Initialize Kakao SDK
      const { Kakao } = window as any;
      
      // Request access token
      const { access_token } = await new Promise<KakaoAuthResponse>((resolve, reject) => {
        Kakao.Auth.login({
          success: (response: KakaoAuthResponse) => resolve(response),
          fail: (error: Error) => reject(error),
        });
      });

      // Send token to backend
      const isNewUser = await socialLogin('kakao', access_token);
      await handleSocialLoginSuccess(isNewUser);
    } catch (error) {
      console.error('Kakao login failed:', error);
      if (onError) {
        onError(error as Error);
      }
    }
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <GoogleButton
        variant="contained"
        startIcon={<GoogleIcon />}
        onClick={handleGoogleLogin}
        disabled={disabled}
      >
        Continue with Google
      </GoogleButton>
      
      <KakaoButton
        variant="contained"
        startIcon={<KakaoTalkIcon />}
        onClick={handleKakaoLogin}
        disabled={disabled}
      >
        Continue with Kakao
      </KakaoButton>

      <DividerWithText>
        <Typography variant="body2">OR</Typography>
      </DividerWithText>
    </Stack>
  );
};

export default SocialLogin; 