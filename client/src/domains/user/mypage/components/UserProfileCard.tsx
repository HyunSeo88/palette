import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { IUserProfile } from '../../../../types/user';
import { 
  MYPAGE_PROFILE_AVATAR_SIZE,
  ANIMATION_DURATION_STANDARD,
  APPLE_EASING 
} from '../../../../constants/animations';

interface UserProfileCardProps {
  userProfile: IUserProfile;
}

const ProfileCard = styled(motion.div)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
  }
}));

const ProfileAvatar = styled(Avatar)({
  width: MYPAGE_PROFILE_AVATAR_SIZE,
  height: MYPAGE_PROFILE_AVATAR_SIZE,
  border: '3px solid rgba(255, 255, 255, 0.8)',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  marginBottom: '16px',
});

const UserProfileCard: React.FC<UserProfileCardProps> = ({ userProfile }) => {
  return (
    <ProfileCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: {
          duration: ANIMATION_DURATION_STANDARD,
          ease: APPLE_EASING
        }
      }}
    >
      <Box display="flex" alignItems="center" gap={3}>
        <ProfileAvatar 
          src={userProfile.profilePicture || userProfile.photoURL || 'https://placehold.co/100x100/007aff/ffffff?text=U'} 
          alt={userProfile.nickname}
        />
        <Box flex={1}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
              fontWeight: 600,
              color: '#1d1d1f',
              letterSpacing: '-0.02em',
              mb: 1
            }}
          >
            {userProfile.nickname}
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{
              color: '#86868b',
              fontSize: '1.1rem',
              fontWeight: 400,
              mb: userProfile.bio ? 2 : 0
            }}
          >
            {userProfile.email}
          </Typography>
          {userProfile.bio && (
            <Typography 
              variant="body1" 
              sx={{
                color: '#1d1d1f',
                fontSize: '1rem',
                lineHeight: 1.5,
                maxWidth: '600px'
              }}
            >
              {userProfile.bio}
            </Typography>
          )}
        </Box>
      </Box>
    </ProfileCard>
  );
};

export default UserProfileCard; 