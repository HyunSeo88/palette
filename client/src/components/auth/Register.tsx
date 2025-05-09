import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Check as CheckIcon, 
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { registerSchema, type RegisterFormData } from '../../utils/validationSchemas';
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
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

const PasswordRequirements = ({ password }: { password: string }) => {
  const requirements = [
    { regex: /.{8,}/, text: '8자 이상' },
    { regex: /[A-Z]/, text: '대문자 포함' },
    { regex: /[a-z]/, text: '소문자 포함' },
    { regex: /[0-9]/, text: '숫자 포함' },
    { regex: /[^A-Za-z0-9]/, text: '특수문자 포함' },
  ];

  return (
    <List dense sx={{ mt: 1 }}>
      {requirements.map(({ regex, text }, index) => (
        <ListItem key={index} dense>
          <ListItemIcon sx={{ minWidth: 36 }}>
            {regex.test(password) ? (
              <CheckIcon color="success" fontSize="small" />
            ) : (
              <CloseIcon color="error" fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText 
            primary={text}
            sx={{ 
              '& .MuiListItemText-primary': { 
                fontSize: '0.875rem',
                color: regex.test(password) ? 'success.main' : 'error.main'
              }
            }}
          />
        </ListItem>
      ))}
    </List>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<{
    message: string;
    field?: string;
  } | null>(null);
  const [showLoginOption, setShowLoginOption] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange'
  });

  const password = watch('password');

  const handleBack = () => {
    navigate(-1);
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      setFormError(null);
      setShowLoginOption(false);
      console.log('[Register onSubmit] Starting registration process...', data);

      const result = await registerUser(data);
      console.log('[Register onSubmit] Received registration result:', result);

      // 이메일 인증이 필요한 경우 (성공)
      if (result.success && result.data?.requiresVerification) {
        console.log('[Register onSubmit] Email verification required. Showing verification message.');
        navigate('/verify-email', {
          replace: true,
          state: {
            email: data.email,
            message: result.message || '이메일 인증이 필요합니다.',
            showResend: true
          }
        });
        return;
      }

      // 일반적인 성공 케이스 (이메일 인증 불필요)
      if (result.success && !result.data?.requiresVerification) {
        console.log('[Register onSubmit] Registration successful (no verification needed). Navigating to /.');
        navigate('/', { replace: true });
        return;
      }

      // 실패 케이스
      console.log('[Register onSubmit] Registration failed:', result);
      if (result.error) {
        setFormError(result.error);
        // 이메일 중복 에러 처리
        if (result.error.field === 'email' && result.error.message.includes('이미 사용 중')) {
          setShowLoginOption(true);
        }
      } else {
        setFormError({ message: result.message || '회원가입에 실패했습니다.' });
      }
    } catch (err: any) {
      console.error('[Register onSubmit] Unexpected error during registration:', err);
      // 401 에러는 이메일 인증이 필요한 경우일 수 있음
      if (err.response?.status === 401) {
        navigate('/verify-email', {
          replace: true,
          state: {
            email: data.email,
            message: '이메일 인증이 필요합니다.',
            showResend: true
          }
        });
        return;
      }
      setFormError({
        message: err.response?.data?.message || '회원가입 처리 중 오류가 발생했습니다.',
        field: 'general'
      });
    } finally {
      setIsSubmitting(false);
      console.log('[Register onSubmit] Registration process finished.');
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
          회원가입
        </Typography>
      </Box>

      {formError && (
        <Alert 
          severity="error"
          sx={{ mt: 2, mb: 2 }}
          action={showLoginOption && (
            <Button
              color="inherit"
              size="small"
              onClick={() => navigate('/login')}
            >
              로그인하기
            </Button>
          )}
        >
          {formError.message}
        </Alert>
      )}

      <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          {...register('email')}
          variant="outlined"
          margin="normal"
          fullWidth
          id="email"
          label="이메일 주소"
          autoComplete="email"
          error={!!errors.email || formError?.field === 'email'}
          helperText={
            (formError?.field === 'email' && formError.message) ||
            errors.email?.message
          }
        />

        <TextField
          {...register('password')}
          variant="outlined"
          margin="normal"
          fullWidth
          label="비밀번호"
          type="password"
          id="password"
          autoComplete="new-password"
          error={!!errors.password || formError?.field === 'password'}
          helperText={
            (formError?.field === 'password' && formError.message) ||
            errors.password?.message
          }
        />

        <PasswordRequirements password={password} />

        <TextField
          {...register('confirmPassword')}
          variant="outlined"
          margin="normal"
          fullWidth
          label="비밀번호 확인"
          type="password"
          id="confirmPassword"
          autoComplete="new-password"
          error={!!errors.confirmPassword || formError?.field === 'confirmPassword'}
          helperText={
            (formError?.field === 'confirmPassword' && formError.message) ||
            errors.confirmPassword?.message
          }
        />

        <TextField
          {...register('nickname')}
          variant="outlined"
          margin="normal"
          fullWidth
          label="닉네임"
          id="nickname"
          error={!!errors.nickname || formError?.field === 'nickname'}
          helperText={
            (formError?.field === 'nickname' && formError.message) ||
            errors.nickname?.message
          }
        />

        <FormControl 
          fullWidth 
          margin="normal"
          error={!!errors.colorVisionType || formError?.field === 'colorVisionType'}
        >
          <InputLabel id="colorVisionType-label">색각이상 유형</InputLabel>
          <Select
            {...register('colorVisionType')}
            labelId="colorVisionType-label"
            id="colorVisionType"
            label="색각이상 유형"
            defaultValue="normal"
          >
            <MenuItem value="normal">일반</MenuItem>
            <MenuItem value="protanopia">제1색각이상 (적색맹)</MenuItem>
            <MenuItem value="deuteranopia">제2색각이상 (녹색맹)</MenuItem>
            <MenuItem value="tritanopia">제3색각이상 (청색맹)</MenuItem>
            <MenuItem value="monochromacy">전색맹</MenuItem>
          </Select>
          {(formError?.field === 'colorVisionType' && (
            <FormHelperText>{formError.message}</FormHelperText>
          )) || (
            errors.colorVisionType && (
              <FormHelperText>{errors.colorVisionType.message}</FormHelperText>
            )
          )}
        </FormControl>

        <TextField
          {...register('bio')}
          variant="outlined"
          margin="normal"
          fullWidth
          label="자기소개"
          id="bio"
          multiline
          rows={4}
          error={!!errors.bio || formError?.field === 'bio'}
          helperText={
            (formError?.field === 'bio' && formError.message) ||
            errors.bio?.message
          }
        />

        <SubmitButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              처리 중...
            </>
          ) : '회원가입'}
        </SubmitButton>

        <Box mt={2}>
          <Typography variant="body2" color="textSecondary" align="center">
            이미 계정이 있으신가요?{' '}
            <Button
              color="primary"
              onClick={() => navigate('/login')}
              disabled={isSubmitting}
            >
              로그인
            </Button>
          </Typography>
        </Box>

        <Box mt={3}>
          <SocialLogin
            flowIntent="signup"
            onSuccess={() => navigate('/onboarding')}
            onError={(error) => setFormError({ message: error.message || '소셜 로그인 중 오류가 발생했습니다.' })}
            disabled={isSubmitting}
          />
        </Box>
      </StyledForm>
    </FormContainer>
  );
};

export default Register; 