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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
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
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      nickname: '',
      colorVisionType: 'normal',
      bio: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const success = await registerUser(data);
      
      if (success) {
        // Navigate to email verification page after successful registration
        navigate(`/verify-email?email=${encodeURIComponent(data.email)}`, { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLoginSuccess = () => {
    navigate('/onboarding');
  };

  const handleSocialLoginError = (error: Error) => {
    setError(error.message);
  };

  return (
    <FormContainer maxWidth="xs">
      <Typography component="h1" variant="h5">
        회원가입
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
          {error}
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
          error={!!errors.email}
          helperText={errors.email?.message}
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
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <PasswordRequirements password={password || ''} />

        <TextField
          {...register('confirmPassword')}
          variant="outlined"
          margin="normal"
          fullWidth
          label="비밀번호 확인"
          type="password"
          id="confirmPassword"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />

        <TextField
          {...register('nickname')}
          variant="outlined"
          margin="normal"
          fullWidth
          label="닉네임"
          id="nickname"
          error={!!errors.nickname}
          helperText={errors.nickname?.message}
        />

        <FormControl 
          fullWidth 
          margin="normal"
          error={!!errors.colorVisionType}
        >
          <InputLabel id="colorVisionType-label">색각이상 유형</InputLabel>
          <Select
            {...register('colorVisionType')}
            labelId="colorVisionType-label"
            id="colorVisionType"
            label="색각이상 유형"
            defaultValue=""
          >
            <MenuItem value="normal">일반</MenuItem>
            <MenuItem value="protanopia">제1색각이상 (적색맹)</MenuItem>
            <MenuItem value="deuteranopia">제2색각이상 (녹색맹)</MenuItem>
            <MenuItem value="tritanopia">제3색각이상 (청색맹)</MenuItem>
            <MenuItem value="monochromacy">전색맹</MenuItem>
          </Select>
          {errors.colorVisionType && (
            <FormHelperText>{errors.colorVisionType.message}</FormHelperText>
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
          error={!!errors.bio}
          helperText={errors.bio?.message}
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
          ) : (
            '회원가입'
          )}
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
            onSuccess={handleSocialLoginSuccess}
            onError={handleSocialLoginError}
            disabled={isSubmitting}
          />
        </Box>
      </StyledForm>
    </FormContainer>
  );
};

export default Register; 