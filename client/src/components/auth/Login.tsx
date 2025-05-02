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
  IconButton,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { loginSchema, type LoginFormData } from '../../utils/validationSchemas';
import SocialLogin from './SocialLogin';

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
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleBack = () => {
    navigate(-1);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      if (clearError) {
        clearError();
      }
      console.log('Attempting login...'); // 디버깅용 로그
      const success = await login(data.email, data.password, false);
      console.log('Login result:', success); // 디버깅용 로그
      
      if (success) {
        console.log('Login successful, redirecting...'); // 디버깅용 로그
        navigate('/', { replace: true });
      } else {
        setError('root', {
          type: 'manual',
          message: '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.',
        });
      }
    } catch (error) {
      console.error('Login error:', error); // 디버깅용 로그
      setError('root', {
        type: 'manual',
        message: '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      });
    }
  };

  return (
    <FormContainer maxWidth="xs">
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', mb: 3, position: 'relative' }}>
        <IconButton
          onClick={handleBack}
          sx={{ position: 'absolute', left: 0 }}
          aria-label="뒤로 가기"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography component="h1" variant="h5" sx={{ width: '100%', textAlign: 'center' }}>
          로그인
        </Typography>
      </Box>
      
      {authError && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {authError}
        </Alert>
      )}

      {errors.root && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {errors.root.message}
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

        <SocialLogin disabled={isSubmitting} />

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