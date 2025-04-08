import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, IconButton, Paper, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { Feather, Bookmark, MessageCircle, MoreHorizontal } from 'react-feather';
import {
  FeedCard,
  VoteContainer,
  VoteOption,
} from '../MainLayout/MainLayout.styles';

const FeedCardItem = ({ item, index, layoutType = 'grid' }) => {
  const { itemType, title, imageUrl, description, author, likes, pollOptions, eventButtonText } = item;

  // --- MASONRY LAYOUT FOR OOTD (Simplified Structure) ---
  if (layoutType === 'masonry' && itemType === 'outfit') {
    return (
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: index * 0.03 }}
        sx={{ 
          borderRadius: 2, 
          overflow: 'hidden',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          backgroundColor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <img
          src={imageUrl}
          alt={title || `오늘의 코디 사진 ${index + 1}`}
          style={{ display: 'block', width: '100%', height: 'auto' }}
          loading="lazy"
        />
        <Box sx={{ p: 1.5 }}>
          <Typography variant="body2" noWrap sx={{ fontWeight: 500, mb: 0.5, fontSize: '0.85rem' }}>
            {title || `OOTD ${index + 1}`}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, overflow: 'hidden' }}>
              <Avatar sx={{ width: 20, height: 20 }} src={`https://i.pravatar.cc/20?u=${author?.name || index}`} />
              <Typography variant="caption" noWrap sx={{ fontSize: '0.75rem' }}>
                {author?.name || `User ${index}`}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex' }}>
              <IconButton size="small" sx={{ p: 0.2 }} aria-label="More options">
                <MoreHorizontal style={{ fontSize: 16 }} />
              </IconButton>
              <IconButton size="small" sx={{ p: 0.2 }} aria-label="Like">
                <Feather style={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  // --- GRID LAYOUT FOR OTHER ITEMS --- (Keep original logic)
  let cardContent;
  switch (itemType) {
    case 'poll':
      cardContent = (
        <>
          <Typography variant="h6" gutterBottom>{title}</Typography>
          <VoteContainer>
            {(pollOptions || []).map((option, idx) => (
              <VoteOption key={idx} isSelected={option.isSelected}>
                <Typography variant="body2">{option.text}</Typography>
              </VoteOption>
            ))}
          </VoteContainer>
        </>
      );
      break;
    case 'event':
      const EventCardImage = require('../MainLayout/MainLayout.styles').CardImage;
      cardContent = (
        <>
          <EventCardImage src={imageUrl || `https://source.unsplash.com/random/400x300?sale&sig=${index}`} alt={title} />
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {description}
          </Typography>
          <Button variant="contained" size="small" sx={{ mt: 1, alignSelf: 'flex-start' }}>
            {eventButtonText || '자세히 보기'}
          </Button>
        </>
      );
      break;
    default: // hot, etc.
      const DefaultCardImage = require('../MainLayout/MainLayout.styles').CardImage;
      cardContent = (
        <>
          <DefaultCardImage src={imageUrl || `https://source.unsplash.com/random/400x400?style&sig=${index}`} alt={title} />
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {description}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Avatar sx={{ width: 24, height: 24 }} src={author?.avatarUrl || `https://i.pravatar.cc/24?u=${index}`} />
              <Typography variant="caption" color="text.secondary">{author?.name || `User ${index + 1}`}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Feather size={14} />
              <Typography variant="caption">{likes ?? Math.floor(Math.random() * 100)}</Typography>
            </Box>
          </Box>
        </>
      );
      break;
  }

  return (
    <FeedCard
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      {cardContent}
    </FeedCard>
  );
};

FeedCardItem.propTypes = {
  item: PropTypes.shape({
    itemType: PropTypes.string.isRequired,
    title: PropTypes.string,
    imageUrl: PropTypes.string,
    description: PropTypes.string,
    author: PropTypes.shape({
      name: PropTypes.string,
      avatarUrl: PropTypes.string,
    }),
    likes: PropTypes.number,
    pollOptions: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string,
      isSelected: PropTypes.bool,
    })),
    eventButtonText: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  layoutType: PropTypes.oneOf(['grid', 'masonry']),
};

export default FeedCardItem; 