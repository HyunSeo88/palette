import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types/user';
import { Container, Typography, Paper, Box, TextField, Button, CircularProgress, Alert } from '@mui/material';
import BackButton from '../components/common/BackButton';

const SocialOnboardingPage: React.FC = () => {
  const { user, updateProfile, loading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 사용자가 인증되지 않았거나, 로딩 중이 아니고 이미 온보딩 정보가 충분한 경우 (예: 닉네임이 User_xxx 형태가 아닌 경우)
    // 또는 소셜 로그인 통해 바로 생성된 임시 유저가 아닌 경우 (예: provider가 email인 경우)
    // 는 이 페이지에 접근할 필요가 없으므로 메인으로 보냅니다.
    // 이 로직은 더 정교하게 만들 수 있습니다. (예: user 객체에 isSocialOnboardingCompleted 플래그 추가)
    if (!authLoading && !isAuthenticated) {
      console.warn('SocialOnboardingPage: User not authenticated. Redirecting to login.');
      navigate('/login');
      return;
    }

    if (user) {
      setNickname(user.nickname || '');
      setBio(user.bio || '');
      // 만약 닉네임이 기본 패턴 (예: 'User_')이 아니거나, 이미 bio가 있다면 온보딩이 불필요하다고 간주할 수도 있습니다.
      // 혹은 서버에서 isNewUser 플래그를 받아 리다이렉트 시점에만 이 페이지로 오도록 하는 것이 더 좋습니다.
      // 현재는 AuthContext의 isNewUser가 직접 이 페이지로 리다이렉트 한다고 가정합니다.
    }
  }, [user, authLoading, isAuthenticated, navigate]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nickname.trim()) {
      setError('닉네임은 필수 항목입니다. 공백만으로는 설정할 수 없습니다.');
      return;
    }
    if (nickname.length < 2 || nickname.length > 30) {
      setError('닉네임은 2자 이상 30자 이하로 입력해주세요.');
      return;
    }
    if (bio.length > 200) {
      setError('자기소개는 최대 200자까지 입력할 수 있습니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Partial<User> 타입을 명시적으로 사용합니다.
      const profileData: Partial<User> = { nickname: nickname.trim(), bio };
      const success = await updateProfile(profileData);
      if (success) {
        navigate('/'); // 온보딩 완료 후 메인 페이지로 이동
      } else {
        setError('프로필 업데이트에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    } catch (err: any) {
      setError(err.message || '프로필 업데이트 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }, [nickname, bio, updateProfile, navigate]);

  // authLoading 중이거나, 인증은 되었지만 user 객체가 아직 없을 때 (드문 경우)
  if (authLoading || (isAuthenticated && !user)) {
    return (
      <Box position="relative">
        <BackButton position="fixed" top={24} left={24} />
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Container>
      </Box>
    );
  }
  
  // 인증되지 않은 사용자는 useEffect에서 /login으로 보냅니다.
  if (!isAuthenticated) {
    return null; // Or a more specific "Redirecting to login..." message
  }

  return (
    <Box position="relative">
      <BackButton position="fixed" top={24} left={24} />
      <Container maxWidth="sm" sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            프로필 설정
          </Typography>
          <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 4 }}>
            Palette 커뮤니티 활동을 위해 프로필을 설정해주세요.
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="닉네임"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="2~30자 이내로 입력"
              required
              margin="normal"
              sx={{ mb: 3 }}
            />
            
            <TextField
              fullWidth
              label="자기소개"
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="자신을 간단하게 소개해주세요 (최대 200자)"
              multiline
              rows={4}
              inputProps={{ maxLength: 200 }}
              margin="normal"
              sx={{ mb: 3 }}
            />
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting || authLoading}
              size="large"
              sx={{ py: 1.5 }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Palette 시작하기'
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SocialOnboardingPage; 