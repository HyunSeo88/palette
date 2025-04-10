import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../contexts/AuthContext';
import { ProfileUpdateData, User } from '../../types/user';
import { profileUpdateSchema } from '../../utils/validationSchemas';
import {
  Avatar,
  Box,
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Camera as CameraIcon } from 'react-feather';

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  margin: '0 auto',
  marginBottom: theme.spacing(3),
}));

const UploadButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: -10,
  bottom: -10,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      nickname: user?.nickname || '',
      bio: user?.bio || '',
      colorVisionType: user?.colorVisionType,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      preferences: user?.preferences ? {
        styles: user.preferences.styles || [],
        interests: user.preferences.interests || [],
        colorSchemes: user.preferences.colorSchemes || [],
      } : undefined,
    },
  });

  const onSubmit = async (data: ProfileUpdateData) => {
    try {
      setError(null);
      setSuccessMessage(null);
      
      // Convert ProfileUpdateData to Partial<User>
      const updateData: Partial<User> = {
        nickname: data.nickname,
        bio: data.bio,
        colorVisionType: data.colorVisionType,
        preferences: data.preferences ? {
          styles: data.preferences.styles || [],
          interests: data.preferences.interests || [],
          colorSchemes: data.preferences.colorSchemes || [],
        } : undefined
      };

      const success = await updateProfile(updateData);
      
      if (success) {
        setSuccessMessage('프로필이 성공적으로 업데이트되었습니다.');
        reset(data);
      }
    } catch (err) {
      setError('프로필 업데이트에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          프로필 설정
        </Typography>

        <Box sx={{ position: 'relative', width: 'fit-content', margin: '0 auto' }}>
          <ProfileAvatar src={user.photoURL} alt={user.nickname}>
            {user.nickname[0]}
          </ProfileAvatar>
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            style={{ display: 'none' }}
          />
          <label htmlFor="avatar-upload">
            <IconButton
              size="small"
              sx={{
                position: 'absolute',
                right: -10,
                bottom: -10,
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              <CameraIcon size={20} />
            </IconButton>
          </label>
        </Box>

        {successMessage && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {successMessage}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 3 }}>
          <TextField
            {...register('nickname')}
            margin="normal"
            fullWidth
            label="닉네임"
            error={!!errors.nickname}
            helperText={errors.nickname?.message}
          />

          <TextField
            {...register('bio')}
            margin="normal"
            fullWidth
            multiline
            rows={4}
            label="자기소개"
            error={!!errors.bio}
            helperText={errors.bio?.message}
          />

          <TextField
            {...register('currentPassword')}
            margin="normal"
            fullWidth
            type="password"
            label="현재 비밀번호"
            error={!!errors.currentPassword}
            helperText={errors.currentPassword?.message}
          />

          <TextField
            {...register('newPassword')}
            margin="normal"
            fullWidth
            type="password"
            label="새 비밀번호"
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
          />

          <TextField
            {...register('confirmNewPassword')}
            margin="normal"
            fullWidth
            type="password"
            label="새 비밀번호 확인"
            error={!!errors.confirmNewPassword}
            helperText={errors.confirmNewPassword?.message}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : '프로필 업데이트'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile; 