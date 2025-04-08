import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, IconButton, Avatar, Chip } from '@mui/material';
import { BookmarkBorder, FavoriteBorder, MoreHoriz } from '@mui/icons-material'; // Using MUI icons
import {
  CardWrapper,
  ImageContainer,
  StyledImage,
  Overlay,
  TopActions,
  BottomInfo,
  AuthorInfo,
} from './Card.styles';

const Card = ({ item }) => {
  const { id, type, title, imageUrl, description, author, likes } = item;

  const renderContentTypeTag = () => {
    let label = type.toUpperCase();
    let color = 'default';
    if (type === 'ootd') { label = 'OOTD'; color = 'secondary'; }
    if (type === 'hot') { label = 'HOT'; color = 'error'; }
    if (type === 'event') { label = 'EVENT'; color = 'info'; }

    return <Chip label={label} color={color} size="small" sx={{ mr: 1 }} />;
  };

  return (
    <CardWrapper>
      <ImageContainer>
        <StyledImage src={imageUrl} alt={title} />
        <Overlay className="card-overlay">
          <TopActions>
            {renderContentTypeTag()}
            <IconButton size="small" sx={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.4)' }}>
              <BookmarkBorder fontSize="small" />
            </IconButton>
          </TopActions>
          <BottomInfo>
            <Typography variant="body2" noWrap sx={{ color: 'white', fontWeight: 'bold', mb: 0.5 }}>
              {title}
            </Typography>
            <AuthorInfo>
              <Avatar sx={{ width: 20, height: 20, mr: 0.5 }} alt={author} src={`https://i.pravatar.cc/20?u=${author}`} />
              <Typography variant="caption" sx={{ color: 'white' }}>{author}</Typography>
            </AuthorInfo>
          </BottomInfo>
        </Overlay>
      </ImageContainer>
      {/* Optional: Display minimal info always visible below image */}
      {/*
      <Box sx={{ p: 1 }}>
        <Typography variant="caption" display="block" noWrap>{title}</Typography>
      </Box>
      */}
    </CardWrapper>
  );
};

Card.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string,
    title: PropTypes.string,
    imageUrl: PropTypes.string,
    description: PropTypes.string,
    author: PropTypes.string,
    likes: PropTypes.number,
  }).isRequired,
};

export default Card; 