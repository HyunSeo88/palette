import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import { resetPasswordSchema, type ResetPasswordFormData } from '../../utils/validationSchemas';

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

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updatePassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidToken, setIsValidToken] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Get token from URL
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;
    
    try {
      setIsSubmitting(true);
      setError(null);

      // Call API to reset password with token
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Navigate to login with success message
        navigate('/login', {
          state: { message: '비밀번호가 성공적으로 재설정되었습니다. 새 비밀번호로 로그인해주세요.' }
        });
      } else {
        setError(result.message || '비밀번호 재설정에 실패했습니다.');
      }
    } catch (err) {
      setError('비밀번호 재설정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isValidToken) {
    return null;
  }

  return (
    <FormContainer maxWidth="xs">
      <Typography component="h1" variant="h5">
        새 비밀번호 설정
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
          {error}
        </Alert>
      )}

      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register('password')}
          variant="outlined"
          margin="normal"
          fullWidth
          label="새 비밀번호"
          type="password"
          id="password"
          autoComplete="new-password"
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <TextField
          {...register('confirmPassword')}
          variant="outlined"
          margin="normal"
          fullWidth
          label="새 비밀번호 확인"
          type="password"
          id="confirmPassword"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
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
            '비밀번호 변경'
          )}
        </SubmitButton>
      </StyledForm>
    </FormContainer>
  );
};

export default ResetPassword; 