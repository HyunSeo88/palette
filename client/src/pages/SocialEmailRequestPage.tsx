import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, TextField, Button, Typography, Paper, Box, CircularProgress, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const emailSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface LocationState {
  tempKakaoProfile?: {
    kakaoId: string;
    nickname?: string;
    profileImage?: string;
  };
  provider?: 'kakao'; // Only Kakao is expected for now, but could be expanded
}

const SocialEmailRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeKakaoSignup } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { tempKakaoProfile, provider } = (location.state as LocationState) || {};

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  useEffect(() => {
    if (!tempKakaoProfile || provider !== 'kakao') {
      console.warn('SocialEmailRequestPage: Missing tempKakaoProfile or provider is not kakao. Redirecting.');
      navigate('/login');
    }
  }, [tempKakaoProfile, provider, navigate]);

  const onSubmit = async (data: EmailFormData) => {
    if (!tempKakaoProfile || provider !== 'kakao') return;

    setIsLoading(true);
    setApiError(null);

    try {
      console.log('Attempting to complete Kakao signup with email:', data.email, tempKakaoProfile);

      const profileToComplete = {
        kakaoId: tempKakaoProfile.kakaoId,
        email: data.email,
        nickname: tempKakaoProfile.nickname,
        profileImage: tempKakaoProfile.profileImage,
      };

      const result = await completeKakaoSignup(profileToComplete);

      if (result.success) {
        if (result.isNewUser) {
          navigate('/social-onboarding', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        setApiError(result.message || '카카오 계정 가입 완료에 실패했습니다.');
      }
    } catch (err: any) {
      setApiError(err.message || '이메일 제출 중 예상치 못한 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!tempKakaoProfile || provider !== 'kakao') {
    return (
      <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" gutterBottom>
          카카오 계정 이메일 등록
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
          안녕하세요, {tempKakaoProfile.nickname || '사용자'}님! Palette 서비스 가입을 위해 이메일 주소를 입력해주세요.
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="이메일 주소"
            autoComplete="email"
            autoFocus
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          
          {apiError && (
            <Alert severity="error" sx={{ mt: 2, mb: 1, width: '100%' }}>
              {apiError}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : '제출하고 가입 완료'}
          </Button>
        </Box>
        <Button fullWidth onClick={() => navigate('/login')}>
          로그인 페이지로 돌아가기
        </Button>
      </Paper>
    </Container>
  );
};

export default SocialEmailRequestPage; 