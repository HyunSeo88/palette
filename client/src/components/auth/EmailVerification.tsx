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
  const [isVerifying, setIsVerifying] = useState(false);
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
          console.log('[EmailVerification] No token in URL, but state message exists:', state.message);
        } else {
          setStatus('error');
          setMessage('유효하지 않은 인증 링크입니다. 토큰이 없습니다.');
          console.error('[EmailVerification] Invalid verification link: No token in URL and no state message');
        }
        return;
      }

      if (isVerifying) {
        console.log('[EmailVerification] Verification API call already in progress, skipping.');
        return;
      }
      // 현재 토큰에 대한 인증 상태가 이미 확정되었다면 중복 호출 방지
      // (단, 이 useEffect는 token이 바뀔때만 실행되도록 의존성배열을 [token, verifyEmail]로 수정했으므로
      // 이 조건은 token이 바뀌지 않았는데 다른 이유로 재실행될 경우를 위한 추가 방어막)
      if (status === 'success' || status === 'error') {
         console.log(`[EmailVerification] Status for current token is already '${status}', not re-verifying unless token changes.`);
        return;
      }
      
      setIsVerifying(true);
      setStatus('verifying');
      setMessage('이메일 인증을 진행중입니다...');
      console.log('[EmailVerification] useEffect triggered. Token:', token, 'Attempting verification.');
      
      try {
        const result = await verifyEmail(token);
        console.log('[EmailVerification] verifyEmail API call returned:', result);
        
        if (result.success) {
          setStatus('success');
          setMessage(result.message || '이메일 인증이 성공적으로 완료되었습니다. 로그인 페이지로 직접 이동해주세요.');
        } else {
          setStatus('error');
          setMessage(result.message || '이메일 인증에 실패했습니다. 다시 시도해주세요.'); 
          console.error('[EmailVerification] Email verification failed from API:', result.message);

          const currentEmailForResend = state?.email || localStorage.getItem('lastRegisteredEmail');
          if (currentEmailForResend) {
            console.log('[EmailVerification] Setting up state for resend option. Email:', currentEmailForResend);
            // navigate가 useEffect를 다시 트리거하지 않도록 의존성 배열에서 state 관련 항목을 제거했으므로,
            // 이 navigate는 더 이상 문제를 일으키지 않아야 합니다.
            // 다만, state 업데이트가 꼭 필요한 경우인지 확인하는 조건 추가.
            if (!state?.showResend || state?.email !== currentEmailForResend || state?.message !== (result.message || '인증 토큰이 만료되었거나 유효하지 않습니다. 인증 이메일을 재발송해주세요.')) {
                setTimeout(() => {
                    navigate(location.pathname + location.search, { 
                      state: { 
                        email: currentEmailForResend, 
                        showResend: true,
                        message: result.message || '인증 토큰이 만료되었거나 유효하지 않습니다. 인증 이메일을 재발송해주세요.' 
                      },
                      replace: true
                    });
                  }, 0);
            }
          }
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || '이메일 인증 중 네트워크 또는 시스템 오류가 발생했습니다.');
        console.error('[EmailVerification] Exception during email verification:', error);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token, verifyEmail]);

  const handleResendVerification = async () => {
    if (!state?.email || isResending) return;

    setIsResending(true);
    try {
      const result = await resendVerificationEmail(state.email);
      if (result.success) {
        setMessage(result.message || '인증 이메일이 재발송되었습니다. 이메일을 확인해주세요.');
      } else {
        setMessage(result.message || '인증 이메일 재발송에 실패했습니다.');
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