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
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

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
          setMessage('이메일 인증이 완료되었습니다.');
          // 3초 후 메인 페이지로 이동
          setTimeout(() => navigate('/'), 3000);
        } else {
          setStatus('error');
          setMessage('이메일 인증에 실패했습니다.');
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || '이메일 인증 중 오류가 발생했습니다.');
      }
    };

    verifyToken();
  }, [token, verifyEmail, navigate, state]);

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

  return (
    <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
      {status === 'verifying' && !token && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            이메일 인증
          </Typography>
          <Typography color="text.secondary" paragraph>
            {state?.email}
          </Typography>
        </Box>
      )}

      {status === 'verifying' && token && <CircularProgress sx={{ mb: 3 }} />}

      <Alert 
        severity={status === 'success' ? 'success' : status === 'error' ? 'error' : 'info'}
        sx={{ mb: 3 }}
      >
        <AlertTitle>
          {status === 'success' ? '인증 완료' : 
           status === 'error' ? '인증 실패' : 
           '인증 대기'}
        </AlertTitle>
        <Typography>{message}</Typography>
      </Alert>

      {state?.showResend && state?.email && status !== 'success' && (
        <Button
          variant="outlined"
          onClick={handleResendVerification}
          disabled={isResending}
          sx={{ mt: 2 }}
        >
          {isResending ? '재발송 중...' : '인증 이메일 재발송'}
        </Button>
      )}

      <Button
        variant="text"
        onClick={() => navigate('/login')}
        sx={{ mt: 2, ml: 2 }}
      >
        로그인 페이지로 이동
      </Button>
    </Container>
  );
};

export default EmailVerification; 