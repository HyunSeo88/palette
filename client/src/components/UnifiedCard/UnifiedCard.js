import React from 'react';
import { Typography, Box } from '@mui/material';
import { Heart, MessageCircle, Bookmark } from 'react-feather';
import { UnifiedCard as StyledCard, CardImageContainer, CardImage, CardContent } from '../MainLayout/MainLayout.styles';

const UnifiedCard = ({ item }) => {
  return (
    <StyledCard>
      <CardImageContainer>
        <CardImage
          src={item.image}
          alt={item.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/placeholder.jpg';
          }}
        />
      </CardImageContainer>
      <CardContent>
        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {item.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {item.author}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Heart size={16} />
            <Typography variant="caption">{item.likes}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <MessageCircle size={16} />
            <Typography variant="caption">{item.comments}</Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Bookmark size={16} />
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default UnifiedCard; 