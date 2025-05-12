import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  AlertTitle,
  Button,
  Box,
  Paper,
  Divider,
  Fade,
  Card,
  useTheme,
} from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import EmailIcon from '@mui/icons-material/Email';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useAuth } from '../../contexts/AuthContext';
import BackButton from '../common/BackButton';

interface LocationState {
  email?: string;
  message?: string;
  showResend?: boolean;
}

const EmailVerification: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authContextValue = useAuth();
  const { verifyEmail, resendVerificationEmail } = authContextValue;
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState<string>('이메일 인증을 진행중입니다...');
  const [isResending, setIsResending] = useState(false);
  const theme = useTheme();

  const state = location.state as LocationState;
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        // 토큰이 없는 경우 (회원가입 직후 상태)
        if (state?.message) {
          setStatus('verifying');
          setMessage(state.message);
        } else {
          setStatus('error');
          setMessage('유효하지 않은 인증 링크입니다.');
        }
        return;
      }

      try {
        const result = await verifyEmail(token);
        if (result) {
          setStatus('success');
          setMessage('이메일 인증이 성공적으로 완료되었습니다. 잠시 후 로그인 페이지로 이동합니다.');
          // 3초 후 로그인 페이지로 이동
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setStatus('error');
          setMessage(authContextValue.error || '이메일 인증에 실패했습니다. 다시 시도해주세요.');
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || '이메일 인증 중 오류가 발생했습니다.');
      }
    };

    verifyToken();
  }, [token, verifyEmail, navigate, state, authContextValue]);

  const handleResendVerification = async () => {
    if (!state?.email || isResending) return;

    setIsResending(true);
    try {
      const result = await resendVerificationEmail(state.email);
      if (result) {
        setMessage('인증 이메일이 재발송되었습니다. 이메일을 확인해주세요.');
      } else {
        throw new Error('인증 이메일 재발송에 실패했습니다.');
      }
    } catch (error: any) {
      setMessage(error.message || '인증 이메일 재발송 중 오류가 발생했습니다.');
    } finally {
      setIsResending(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <MarkEmailReadIcon sx={{ fontSize: 80, color: theme.palette.success.main }} />;
      case 'error':
        return <ErrorOutlineIcon sx={{ fontSize: 80, color: theme.palette.error.main }} />;
      default:
        return token ? 
          <CircularProgress size={80} thickness={4} /> : 
          <EmailIcon sx={{ fontSize: 80, color: theme.palette.info.main }} />;
    }
  };

  return (
    <Box position="relative">
      <BackButton position="fixed" top={24} left={24} />
      <Container maxWidth="sm" sx={{ my: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Fade in={true} timeout={800}>
          <Card
            sx={{
              width: '100%',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              borderRadius: 3,
              overflow: 'hidden',
              p: 0,
            }}
          >
            <Box 
              sx={{ 
                p: 4, 
                bgcolor: theme.palette.background.default,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LockOpenIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h4" fontWeight="600">이메일 인증</Typography>
              </Box>
              
              <Box 
                sx={{ 
                  my: 4, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center'
                }}
              >
                {getStatusIcon()}
                
                {status === 'verifying' && !token && (
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ mt: 2, fontWeight: 500 }}
                  >
                    {state?.email}
                  </Typography>
                )}
              </Box>
            </Box>
            
            <Divider />
            
            <Box sx={{ p: 4, bgcolor: 'white' }}>
              <Alert 
                severity={status === 'success' ? 'success' : status === 'error' ? 'error' : 'info'}
                variant="outlined"
                icon={false}
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  py: 2,
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
                }}
              >
                <AlertTitle sx={{ fontWeight: 600 }}>
                  {status === 'success' ? '인증 완료' : 
                   status === 'error' ? '인증 실패' : 
                   '인증 대기'}
                </AlertTitle>
                <Typography variant="body1">{message}</Typography>
              </Alert>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 2 }}>
                {state?.showResend && state?.email && status !== 'success' && (
                  <Button
                    variant="contained"
                    onClick={handleResendVerification}
                    disabled={isResending}
                    sx={{ 
                      borderRadius: 2,
                      px: 3,
                    }}
                    startIcon={<EmailIcon />}
                  >
                    {isResending ? '재발송 중...' : '인증 이메일 재발송'}
                  </Button>
                )}

                <Button
                  variant={state?.showResend && state?.email && status !== 'success' ? "outlined" : "contained"}
                  onClick={() => navigate('/login')}
                  sx={{ 
                    borderRadius: 2,
                    px: 3,
                  }}
                >
                  로그인 페이지로 이동
                </Button>
              </Box>
            </Box>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default EmailVerification; 