import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Link as MuiLink,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../contexts/AuthContext'; // Assuming AuthContext is here
import { Link as RouterLink, useNavigate } from 'react-router-dom';

interface LoginModalDialogProps {
  open: boolean;
  onClose: () => void;
}

const LoginModalContent = styled(DialogContent)(({ theme }) => ({
  paddingTop: theme.spacing(2),
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: theme.spacing(1),
  color: theme.palette.grey[500],
}));

const loginSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'), // Basic validation, can be enhanced
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginModalDialog: React.FC<LoginModalDialogProps> = ({ open, onClose }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password, true);
      onClose(); // Close modal on successful login
      navigate('/'); // Navigate to home/main page
    } catch (error: any) {
      console.error("Login failed:", error);
      let errorMessage = '로그인에 실패했습니다. 다시 시도해주세요.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      setError('root.serverError', { type: 'manual', message: errorMessage });
    }
  };

  const handleNavigateAndClose = (path: string) => {
    onClose();
    navigate(path);
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 2, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="span" sx={{ fontWeight: 'semibold', color: 'text.primary' }}>
          로그인
        </Typography>
        <CloseButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </CloseButton>
      </DialogTitle>
      <LoginModalContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="아이디 (이메일)"
                type="email"
                fullWidth
                margin="normal"
                placeholder="you@example.com"
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{ mb: 2 }}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="비밀번호"
                type="password"
                fullWidth
                margin="normal"
                placeholder="••••••••"
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{ mb: 3 }}
              />
            )}
          />
          {errors.root?.serverError && (
            <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
              {errors.root.serverError.message}
            </Typography>
          )}
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            disabled={isSubmitting}
            sx={{ 
                py: 1.25, 
                fontSize: '1rem', 
                fontWeight: 'semibold', 
                borderRadius: '8px', // From 0.5rem
                textTransform: 'none' 
            }}
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
          </Button>
          <Box sx={{ mt: 2, textAlign: 'center', fontSize: '0.875rem' }}>
            <MuiLink component={RouterLink} to="/register" onClick={() => handleNavigateAndClose('/register')} sx={{ fontWeight: 'medium', textDecoration: 'none' }}>
              회원가입
            </MuiLink>
            <Typography component="span" sx={{ color: 'text.secondary', mx: 0.5 }}>|</Typography>
            <MuiLink component={RouterLink} to="/find-credentials" onClick={() => handleNavigateAndClose('/find-credentials')} sx={{ fontWeight: 'medium', textDecoration: 'none' }}>
              ID/PW 찾기
            </MuiLink>
          </Box>
        </Box>
      </LoginModalContent>
    </Dialog>
  );
};

export default LoginModalDialog; 