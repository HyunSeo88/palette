import React, { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Avatar, IconButton, useTheme, Chip } from '@mui/material';
import { Favorite, FavoriteBorder, CommentOutlined, InfoOutlined, Bookmark, BookmarkBorder } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { IOotdPost } from '../../types/ootd.types';
import { useAuth } from '../../../../contexts/AuthContext';

interface EnhancedOotdCardProps {
  post: IOotdPost;
  isTopPostCard?: boolean;
  onLike: (postId: string, userId: string) => void;
  onComment: (postId: string) => void;
  onInfo: (postId: string) => void;
}

// 스타일드 컴포넌트들
const StyledCard = styled(motion.div)(({ theme }) => ({
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
  overflow: 'hidden',
});

const StyledImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
});

const HoverOverlay = styled(motion.div)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '16px',
  opacity: 0,
  transition: 'opacity 0.3s ease',
});

const QuickActionsContainer = styled(motion.div)({
  display: 'flex',
  gap: '8px',
  alignSelf: 'flex-end',
});

const QuickActionButton = styled(IconButton)({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  color: '#1d1d1f',
  width: '40px',
  height: '40px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    transform: 'scale(1.1)',
  },
  transition: 'all 0.2s ease',
});

const TagsContainer = styled(Box)({
  display: 'flex',
  gap: '6px',
  flexWrap: 'wrap',
  marginBottom: '12px',
});

const TrendyTag = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(0, 122, 255, 0.1)',
  color: '#007aff',
  fontSize: '0.75rem',
  height: '24px',
  fontWeight: 600,
  border: '1px solid rgba(0, 122, 255, 0.2)',
  '&:hover': {
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    transform: 'scale(1.05)',
  },
  transition: 'all 0.2s ease',
}));

const UserInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '12px',
});

const UserAvatar = styled(Avatar)({
  width: 40,
  height: 40,
  marginRight: '12px',
  border: '2px solid rgba(255, 255, 255, 0.8)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
});

const ActionBar = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: '8px',
  borderTop: '1px solid rgba(0, 0, 0, 0.06)',
});

const LikeButton = styled(IconButton)<{ liked: boolean }>(({ theme, liked }) => ({
  color: liked ? '#ff3b30' : '#86868b',
  padding: '6px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: liked ? 'rgba(255, 59, 48, 0.1)' : 'rgba(0, 0, 0, 0.04)',
    transform: 'scale(1.1)',
  }
}));

const TopBadge = styled(motion.div)({
  position: 'absolute',
  top: '12px',
  right: '12px',
  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
  borderRadius: '12px',
  padding: '6px 12px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  boxShadow: '0 4px 16px rgba(255, 107, 107, 0.4)',
  zIndex: 2,
});

// 시간 계산 함수
const timeAgo = (dateString: string): string => {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInMs = now.getTime() - postDate.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) return `${diffInDays}일 전`;
  if (diffInHours > 0) return `${diffInHours}시간 전`;
  return '방금 전';
};

// 애니메이션 variants
const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { y: -2, scale: 1.005 }
};

const overlayVariants = {
  initial: { opacity: 0 },
  hover: { opacity: 1 }
};

const quickActionsVariants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: { opacity: 1, scale: 1 }
};

const EnhancedOotdCard: React.FC<EnhancedOotdCardProps> = ({ 
  post, 
  isTopPostCard, 
  onLike, 
  onComment, 
  onInfo 
}) => {
  const theme = useTheme();
  const { user: currentUser } = useAuth();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const isLikedByCurrentUser = currentUser ? post.likes.includes(currentUser._id) : false;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentUser?._id) {
      onLike(post._id, currentUser._id);
    }
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onComment(post._id);
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onInfo(post._id);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  return (
    <StyledCard
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      layout
    >
      {/* 이미지 컨테이너 */}
      <ImageContainer
        sx={{ 
          height: { xs: 280, sm: 320, md: 360 },
          position: 'relative'
        }}
      >
        <StyledImage
          src={post.images[0] || 'https://placehold.co/600x800/f5f5f7/86868b?text=OOTD'}
          alt={post.title || post.content.substring(0, 30)}
          onLoad={() => setIsImageLoaded(true)}
          style={{
            height: '100%',
          }}
        />
        
        {/* Top 포스트 배지 */}
        <AnimatePresence>
          {isTopPostCard && (
            <TopBadge
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
            >
              <Typography sx={{ fontSize: '12px', color: 'white', fontWeight: 600 }}>
                ⭐ TOP
              </Typography>
            </TopBadge>
          )}
        </AnimatePresence>

        {/* 호버 오버레이 */}
        <HoverOverlay
          variants={overlayVariants}
          initial="initial"
          whileHover="hover"
          sx={{
            '&:hover': {
              opacity: 1,
            }
          }}
        >
          <Box />
          <QuickActionsContainer
            variants={quickActionsVariants}
            initial="initial"
            whileHover="hover"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <QuickActionButton
                onClick={handleLikeClick}
              >
                {isLikedByCurrentUser ? 
                  <Favorite sx={{ fontSize: 18, color: '#ff3b30' }} /> : 
                  <FavoriteBorder sx={{ fontSize: 18 }} />
                }
              </QuickActionButton>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <QuickActionButton
                onClick={handleCommentClick}
              >
                <CommentOutlined sx={{ fontSize: 18 }} />
              </QuickActionButton>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <QuickActionButton
                onClick={handleBookmarkClick}
              >
                {isBookmarked ? 
                  <Bookmark sx={{ fontSize: 18, color: '#007aff' }} /> : 
                  <BookmarkBorder sx={{ fontSize: 18 }} />
                }
              </QuickActionButton>
            </motion.div>
          </QuickActionsContainer>
        </HoverOverlay>
      </ImageContainer>

      {/* 콘텐츠 섹션 */}
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        {/* 사용자 정보 */}
        <UserInfo>
          <UserAvatar 
            src={post.user.profileImage || 'https://placehold.co/100x100/007aff/ffffff?text=U'} 
            alt={post.user.nickname}
          />
          <Box>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600, 
                color: '#1d1d1f',
                fontSize: '0.95rem',
                lineHeight: 1.2
              }}
            >
              {post.user.nickname}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#86868b',
                fontSize: '0.8rem'
              }}
            >
              {timeAgo(post.createdAt)}
            </Typography>
          </Box>
        </UserInfo>

        {/* 콘텐츠 텍스트 */}
        <Typography 
          variant="body2" 
          sx={{
            color: '#1d1d1f',
            mb: 1.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.4,
            fontSize: '0.9rem'
          }}
        >
          {post.content}
        </Typography>

        {/* 트렌디 태그들 */}
        {post.tags && post.tags.length > 0 && (
          <TagsContainer>
            {post.tags.slice(0, 3).map((tag, index) => (
              <motion.div
                key={tag}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: index * 0.1 }
                }}
              >
                <TrendyTag
                  label={`#${tag}`}
                  size="small"
                />
              </motion.div>
            ))}
          </TagsContainer>
        )}

        {/* 액션 바 */}
        <ActionBar>
          <Box display="flex" alignItems="center" gap={2}>
            <Box display="flex" alignItems="center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <LikeButton 
                  size="small" 
                  onClick={handleLikeClick}
                  liked={isLikedByCurrentUser}
                >
                  {isLikedByCurrentUser ? 
                    <Favorite sx={{ fontSize: 16 }} /> : 
                    <FavoriteBorder sx={{ fontSize: 16 }} />
                  }
                </LikeButton>
              </motion.div>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#1d1d1f',
                  ml: 0.5
                }}
              >
                {post.likesCount}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton 
                  size="small" 
                  onClick={handleCommentClick}
                  sx={{ 
                    color: '#86868b',
                    p: 0.5,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <CommentOutlined sx={{ fontSize: 16 }} />
                </IconButton>
              </motion.div>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  color: '#86868b',
                  ml: 0.5
                }}
              >
                {post.commentsCount || 0}
              </Typography>
            </Box>
          </Box>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconButton 
              size="small" 
              onClick={handleInfoClick}
              sx={{ 
                color: '#86868b',
                p: 0.5,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  color: '#007aff',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease'
              }}
            >
              <InfoOutlined sx={{ fontSize: 16 }} />
            </IconButton>
          </motion.div>
        </ActionBar>
      </CardContent>
    </StyledCard>
  );
};

export default EnhancedOotdCard; 