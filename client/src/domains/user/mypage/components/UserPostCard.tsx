import React, { useState } from 'react';
import { Box, Typography, Chip, IconButton } from '@mui/material';
import { Favorite, CommentOutlined, Visibility } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns';
import { IUserPost } from '../../../../types/user';
import { 
  MYPAGE_POST_CARD_HEIGHT,
  ANIMATION_DURATION_STANDARD,
  APPLE_EASING 
} from '../../../../constants/animations';

interface UserPostCardProps {
  post: IUserPost;
  index: number;
}

const PostCard = styled(motion.div)(({ theme }) => ({
  borderRadius: '20px',
  overflow: 'hidden',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  cursor: 'pointer',
  position: 'relative',
  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  '&:hover': {
    transform: 'translateY(-2px) scale(1.005)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
  }
}));

const ImageContainer = styled(Box)({
  position: 'relative',
  height: MYPAGE_POST_CARD_HEIGHT,
  overflow: 'hidden',
});

const PostImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
});

const PlaceholderContainer = styled(Box)({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  color: '#86868b',
});

const ContentSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
}));

const PostTypeChip = styled(Chip)({
  backgroundColor: 'rgba(0, 122, 255, 0.1)',
  color: '#007aff',
  fontSize: '0.75rem',
  height: '24px',
  fontWeight: 600,
  border: '1px solid rgba(0, 122, 255, 0.2)',
  '&:hover': {
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
  },
});

const ActionBar = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '12px',
  paddingTop: '12px',
  borderTop: '1px solid rgba(0, 0, 0, 0.06)',
});

const StatItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});

// 이미지 URL 처리 함수
const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // 절대 URL인 경우 그대로 반환
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // 상대 경로인 경우 API 베이스 URL과 결합
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  return `${API_BASE_URL}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
};

const UserPostCard: React.FC<UserPostCardProps> = ({ post, index }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const imageUrl = post.images && post.images.length > 0 ? getImageUrl(post.images[0]) : '';

  return (
    <PostCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          delay: index * 0.1,
          duration: ANIMATION_DURATION_STANDARD,
          ease: APPLE_EASING
        }
      }}
      whileHover={{ 
        y: -2, 
        scale: 1.005,
        transition: { 
          duration: 0.2,
          ease: APPLE_EASING
        }
      }}
    >
      {/* 이미지 섹션 */}
      <ImageContainer>
        {imageUrl && !imageError ? (
          <PostImage
            src={imageUrl}
            alt={post.title || 'Post image'}
            onError={handleImageError}
          />
        ) : (
          <PlaceholderContainer>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              {post.postType.toUpperCase()}
            </Typography>
          </PlaceholderContainer>
        )}
      </ImageContainer>

      {/* 콘텐츠 섹션 */}
      <ContentSection>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
          <Typography 
            variant="h6" 
            component={RouterLink}
            to={`/posts/${post._id}`}
            sx={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#1d1d1f',
              textDecoration: 'none',
              lineHeight: 1.3,
              flex: 1,
              mr: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              '&:hover': {
                color: '#007aff',
              },
              transition: 'color 0.2s ease'
            }}
          >
            {post.title || 'Untitled Post'}
          </Typography>
          <PostTypeChip 
            label={post.postType.toUpperCase()} 
            size="small" 
          />
        </Box>

        <Typography 
          variant="body2" 
          sx={{
            color: '#86868b',
            fontSize: '0.9rem',
            lineHeight: 1.4,
            mb: 1.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {post.content}
        </Typography>

        <Typography 
          variant="caption" 
          sx={{
            color: '#86868b',
            fontSize: '0.8rem',
            fontWeight: 500
          }}
        >
          {format(new Date(post.createdAt), 'MMM dd, yyyy')}
        </Typography>

        <ActionBar>
          <Box display="flex" gap={2}>
            <StatItem>
              <IconButton size="small" sx={{ p: 0, color: '#ff3b30' }}>
                <Favorite sx={{ fontSize: 16 }} />
              </IconButton>
              <Typography variant="caption" sx={{ fontSize: '0.8rem', color: '#1d1d1f', fontWeight: 500 }}>
                {post.likes?.length || 0}
              </Typography>
            </StatItem>

            <StatItem>
              <IconButton size="small" sx={{ p: 0, color: '#86868b' }}>
                <CommentOutlined sx={{ fontSize: 16 }} />
              </IconButton>
              <Typography variant="caption" sx={{ fontSize: '0.8rem', color: '#1d1d1f', fontWeight: 500 }}>
                {post.commentsCount || 0}
              </Typography>
            </StatItem>
          </Box>

          <IconButton 
            component={RouterLink}
            to={`/posts/${post._id}`}
            size="small" 
            sx={{ 
              color: '#86868b',
              '&:hover': {
                color: '#007aff',
                backgroundColor: 'rgba(0, 122, 255, 0.1)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease'
            }}
          >
            <Visibility sx={{ fontSize: 16 }} />
          </IconButton>
        </ActionBar>
      </ContentSection>
    </PostCard>
  );
};

export default UserPostCard; 