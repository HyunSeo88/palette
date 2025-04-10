import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Container,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  maxWidth: 400,
  margin: '0 auto',
  marginTop: theme.spacing(8)
}));

const EmailVerification: React.FC = () => {
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, resendVerificationEmail } = useAuth();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (!token) {
          setError('유효하지 않은 인증 링크입니다.');
          setVerifying(false);
          return;
        }

        await verifyEmail(token);
        setSuccess(true);
        setVerifying(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : '이메일 인증에 실패했습니다.');
        setVerifying(false);
      }
    };

    verifyToken();
  }, [location.search, verifyEmail]);

  const handleContinue = () => {
    navigate('/login');
  };

  const handleResend = async () => {
    try {
      setResending(true);
      const params = new URLSearchParams(location.search);
      const email = params.get('email');
      
      if (!email) {
        setError('이메일 주소가 없습니다. 회원가입을 다시 진행해주세요.');
        return;
      }

      await resendVerificationEmail(email);
      setError('새로운 인증 이메일이 발송되었습니다. 이메일을 확인해주세요.');
    } catch (err) {
      setError('인증 이메일 재발송에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setResending(false);
    }
  };

  if (verifying) {
    return (
      <Container>
        <StyledPaper>
          <CircularProgress />
          <Typography>이메일 인증을 진행하고 있습니다...</Typography>
        </StyledPaper>
      </Container>
    );
  }

  return (
    <Container>
      <StyledPaper>
        {success ? (
          <>
            <Typography variant="h5" gutterBottom>
              이메일 인증 완료
            </Typography>
            <Alert severity="success">
              이메일이 성공적으로 인증되었습니다.
            </Alert>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleContinue}
            >
              로그인하기
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              이메일 인증 실패
            </Typography>
            <Alert severity="error">{error}</Alert>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleResend}
              disabled={resending}
            >
              {resending ? '재발송 중...' : '인증 이메일 재발송'}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => navigate('/register')}
              disabled={resending}
            >
              회원가입으로 돌아가기
            </Button>
          </>
        )}
      </StyledPaper>
    </Container>
  );
};

export default EmailVerification; 