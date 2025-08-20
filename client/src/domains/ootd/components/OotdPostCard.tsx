import React, { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Avatar, IconButton, useTheme } from '@mui/material';
import { Favorite, FavoriteBorder, CommentOutlined, InfoOutlined } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { IOotdPost } from '../types/ootd.types';
import { useAuth } from '../../../contexts/AuthContext';

interface OotdPostCardProps {
  post: IOotdPost;
  isTopPostCard?: boolean;
  onLike: (postId: string, userId: string) => void;
  onComment: (postId: string) => void;
  onInfo: (postId: string) => void;
}

// 시간 표시 유틸리티 함수
const timeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return `${seconds}초 전`;
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  return `${days}일 전`;
};

// 애플 스타일 애니메이션 variants
const cardVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1]
    }
  },
  hover: {
    y: -2,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const OotdPostCard: React.FC<OotdPostCardProps> = ({ post, isTopPostCard, onLike, onComment, onInfo }) => {
  const theme = useTheme();
  const { user: currentUser } = useAuth();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  console.log('[OotdPostCard] Rendering post:', post, 'Likes count:', post.likesCount);

  const isLikedByCurrentUser = currentUser ? post.likes.includes(currentUser._id) : false;

  const handleLikeClick = () => {
    if (currentUser?._id) {
      onLike(post._id, currentUser._id);
    } else {
      console.warn('User not logged in. Cannot like post.');
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <Card 
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#fff',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-2px)'
          }
        }}
      >
        {/* 이미지 섹션 */}
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            sx={{ 
              height: { xs: 240, sm: 280, md: 320 },
              objectFit: 'cover'
            }}
            image={post.images[0] || 'https://placehold.co/600x800/f5f5f7/86868b?text=OOTD'}
            alt={post.title || post.content.substring(0, 30)}
            onLoad={() => setIsImageLoaded(true)}
          />

          {/* 탑 포스트 배지 */}
          {isTopPostCard && (
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                width: 32,
                height: 32,
                backgroundColor: '#007aff',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)'
              }}
            >
              <Typography sx={{ fontSize: '16px', color: 'white' }}>
                ⭐
              </Typography>
            </Box>
          )}
        </Box>

        {/* 콘텐츠 섹션 */}
        <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
          {/* 사용자 정보 */}
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar 
              src={post.user.profileImage || 'https://placehold.co/100x100/007aff/ffffff?text=U'} 
              alt={post.user.nickname} 
              sx={{ 
                width: { xs: 36, sm: 40 }, 
                height: { xs: 36, sm: 40 }, 
                mr: 1.5
              }}
            />
            <Box>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#1d1d1f',
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                {post.user.nickname}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#86868b',
                  fontSize: { xs: '0.75rem', sm: '0.8rem' }
                }}
              >
                {timeAgo(post.createdAt)}
              </Typography>
            </Box>
          </Box>

          {/* 콘텐츠 텍스트 */}
          <Typography 
            variant="body2" 
            sx={{
              color: '#1d1d1f',
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.4,
              fontSize: { xs: '0.9rem', sm: '0.95rem' }
            }}
          >
            {post.content}
          </Typography>

          {/* 태그 */}
          {post.tags && post.tags.length > 0 && (
            <Box sx={{ mb: 2 }}>
              {post.tags.slice(0, 3).map((tag) => (
                <Box
                  key={tag}
                  component="span"
                  sx={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    margin: '2px 4px 2px 0',
                    borderRadius: '6px',
                    backgroundColor: '#f5f5f7',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: '#86868b'
                  }}
                >
                  #{tag}
                </Box>
              ))}
            </Box>
          )}

          {/* 액션 버튼들 */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={2}>
              <Box display="flex" alignItems="center">
                <IconButton 
                  size="small" 
                  onClick={handleLikeClick} 
                  sx={{ 
                    color: isLikedByCurrentUser ? '#ff3b30' : '#86868b',
                    p: 0.5,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  {isLikedByCurrentUser ? 
                    <Favorite sx={{ fontSize: 18 }} /> : 
                    <FavoriteBorder sx={{ fontSize: 18 }} />
                  }
                </IconButton>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: '#1d1d1f',
                    ml: 0.5
                  }}
                >
                  {post.likesCount}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center">
                <IconButton 
                  size="small" 
                  onClick={() => onComment(post._id)} 
                  sx={{ 
                    color: '#86868b',
                    p: 0.5,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <CommentOutlined sx={{ fontSize: 18 }} />
                </IconButton>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: '#1d1d1f',
                    ml: 0.5
                  }}
                >
                  {post.commentsCount}
                </Typography>
              </Box>
            </Box>

            <IconButton 
              size="small" 
              onClick={() => onInfo(post._id)} 
              sx={{ 
                color: '#86868b',
                p: 0.5,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <InfoOutlined sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OotdPostCard; 