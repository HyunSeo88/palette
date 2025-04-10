import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { loginSchema, type LoginFormData } from '../../utils/validationSchemas';

const FormContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
  '& .MuiTextField-root': {
    marginBottom: theme.spacing(2),
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
  height: 48,
}));

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error: authError, clearError } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      const success = await login(data.email, data.password, false);
      if (success) {
        // Redirect to the page user tried to access, or home
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (error) {
      // Error is handled by AuthContext
      console.error('Login failed:', error);
    }
  };

  return (
    <FormContainer maxWidth="xs">
      <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
        로그인
      </Typography>
      
      {authError && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {authError}
        </Alert>
      )}

      <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          {...register('email')}
          variant="outlined"
          required
          fullWidth
          id="email"
          label="이메일"
          autoComplete="email"
          autoFocus
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        
        <TextField
          {...register('password')}
          variant="outlined"
          required
          fullWidth
          label="비밀번호"
          type="password"
          autoComplete="current-password"
          error={!!errors.password}
          helperText={errors.password?.message}
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
            '로그인'
          )}
        </SubmitButton>

        <Box mt={2} display="flex" flexDirection="column" alignItems="center" gap={1}>
          <Typography variant="body2">
            <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
              비밀번호를 잊으셨나요?
            </Link>
          </Typography>
          <Typography variant="body2">
            아직 회원이 아니신가요?{' '}
            <Link to="/register" style={{ textDecoration: 'none' }}>
              회원가입
            </Link>
          </Typography>
        </Box>
      </StyledForm>
    </FormContainer>
  );
};

export default Login; 