import React from 'react';
import { Box, Typography, SxProps } from '@mui/material';
import { Heart, MessageCircle, Bookmark } from 'react-feather';

// Constants
const ICON_SIZE = 16;

// Styles
const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    mt: 1,
  } as const,
  
  metricItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
  } as const,
  
  bookmark: {
    ml: 'auto',
  } as const,
} as const;

interface PostMetricsProps {
  /** Number of likes on the post */
  likes: number;
  /** Number of comments on the post */
  comments: number;
}

/**
 * PostMetrics Component
 * 
 * Displays post engagement metrics including likes and comments count,
 * along with a bookmark option.
 */
const PostMetrics: React.FC<PostMetricsProps> = ({ likes, comments }) => (
  <Box sx={styles.container}>
    <Box sx={styles.metricItem}>
      <Heart size={ICON_SIZE} />
      <Typography variant="caption">{likes}</Typography>
    </Box>
    <Box sx={styles.metricItem}>
      <MessageCircle size={ICON_SIZE} />
      <Typography variant="caption">{comments}</Typography>
    </Box>
    <Box sx={styles.bookmark}>
      <Bookmark size={ICON_SIZE} />
    </Box>
  </Box>
);

export default PostMetrics; 