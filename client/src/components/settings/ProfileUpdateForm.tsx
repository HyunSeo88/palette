import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types/user'; // User 타입을 가져옵니다.

const ProfileUpdateForm: React.FC = () => {
  const { user, updateProfile, loading: authLoading } = useAuth();
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    if (!nickname.trim()) {
      setError('닉네임은 필수 항목입니다.');
      setIsSubmitting(false);
      return;
    }
    if (nickname.length < 2 || nickname.length > 30) {
      setError('닉네임은 2자 이상 30자 이하로 입력해주세요.');
      setIsSubmitting(false);
      return;
    }
    if (bio.length > 200) {
      setError('자기소개는 최대 200자까지 입력할 수 있습니다.');
      setIsSubmitting(false);
      return;
    }

    const profileData: Partial<User> = {};
    if (nickname !== user?.nickname) profileData.nickname = nickname.trim();
    if (bio !== user?.bio) profileData.bio = bio;

    if (Object.keys(profileData).length === 0) {
      setSuccessMessage('변경 사항이 없습니다.');
      setIsSubmitting(false);
      return;
    }

    try {
      const success = await updateProfile(profileData);
      if (success) {
        setSuccessMessage('프로필이 성공적으로 업데이트되었습니다.');
      } else {
        setError('프로필 업데이트에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err: any) {
      setError(err.message || '프로필 업데이트 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading && !user) {
    return <CircularProgress />;
  }

  if (!user) {
    return <Alert severity="warning">사용자 정보를 불러올 수 없습니다.</Alert>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        프로필 정보 수정
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      
      <TextField
        label="닉네임"
        variant="outlined"
        fullWidth
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        sx={{ mb: 2 }}
        required
        inputProps={{ minLength: 2, maxLength: 30 }}
        error={nickname.trim().length > 0 && (nickname.trim().length < 2 || nickname.trim().length > 30)}
        helperText={ (nickname.trim().length > 0 && (nickname.trim().length < 2 || nickname.trim().length > 30)) ? "닉네임은 2자 이상 30자 이하이어야 합니다." : ""}
      />
      <TextField
        label="자기소개"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        sx={{ mb: 2 }}
        inputProps={{ maxLength: 200 }}
        error={bio.length > 200}
        helperText={bio.length > 200 ? "자기소개는 최대 200자까지 가능합니다." : ""}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isSubmitting || authLoading}
        fullWidth
      >
        {isSubmitting ? <CircularProgress size={24} /> : '프로필 저장'}
      </Button>
    </Box>
  );
};

export default ProfileUpdateForm; 