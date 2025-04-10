import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { Heart, MessageCircle, Bookmark } from 'react-feather';
import { TextCard } from '../../MainLayout/MainLayout.styles';

const TextPost = ({ title, content, author, avatar, likes, comments }) => {
  return (
    <TextCard>
      {/* Author Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Avatar src={avatar} alt={author} sx={{ width: 32, height: 32 }} />
        <Typography variant="subtitle2">{author}</Typography>
      </Box>

      {/* Post Content */}
      <Typography variant="h6" sx={{ mb: 1 }}>{title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {content}
      </Typography>

      {/* Metrics */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        mt: 'auto',
        color: 'text.secondary'
      }}>
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
    </TextCard>
  );
};

export default TextPost; 