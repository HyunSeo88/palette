import React from 'react';
import { Box, Typography } from '@mui/material';
import { Heart, MessageCircle, Bookmark } from 'react-feather';

const PostMetrics = ({ likes, comments }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Heart size={16} />
      <Typography variant="caption">{likes}</Typography>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <MessageCircle size={16} />
      <Typography variant="caption">{comments}</Typography>
    </Box>
    <Box sx={{ ml: 'auto' }}>
      <Bookmark size={16} />
    </Box>
  </Box>
);

export default PostMetrics; 