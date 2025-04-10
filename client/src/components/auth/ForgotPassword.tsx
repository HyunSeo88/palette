import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { resetPasswordRequestSchema, type ResetPasswordRequestFormData } from '../../utils/validationSchemas';

const FormContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordRequestFormData>({
    resolver: zodResolver(resetPasswordRequestSchema),
  });

  const onSubmit = async (data: ResetPasswordRequestFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const success = await resetPassword(data.email);
      
      if (success) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '비밀번호 재설정 요청 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <FormContainer maxWidth="xs">
        <Typography component="h1" variant="h5" gutterBottom>
          이메일을 확인해주세요
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" paragraph>
          비밀번호 재설정 링크를 이메일로 전송했습니다.
          이메일을 확인하고 링크를 클릭하여 비밀번호를 재설정해주세요.
        </Typography>
        <Button
          component={RouterLink}
          to="/login"
          variant="contained"
          color="primary"
          fullWidth
        >
          로그인 페이지로 돌아가기
        </Button>
      </FormContainer>
    );
  }

  return (
    <FormContainer maxWidth="xs">
      <Typography component="h1" variant="h5">
        비밀번호 재설정
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
        가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
          {error}
        </Alert>
      )}

      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register('email')}
          variant="outlined"
          margin="normal"
          fullWidth
          id="email"
          label="이메일 주소"
          autoComplete="email"
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <SubmitButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            '비밀번호 재설정 링크 받기'
          )}
        </SubmitButton>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link component={RouterLink} to="/login" variant="body2">
            로그인 페이지로 돌아가기
          </Link>
        </Box>
      </StyledForm>
    </FormContainer>
  );
};

export default ForgotPassword; 