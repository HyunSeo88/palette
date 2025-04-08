import React from 'react';
import { Box, Typography } from '@mui/material';
import { 
  TextCard,
  OOTDImageContainer,
  OOTDImage,
  OOTDLabel 
} from '../MainLayout/MainLayout.styles';
import { ootdItems, hotPosts, events } from '../../data/feedData';
import PostMetrics from './components/PostMetrics';
import AuthorInfo from './components/AuthorInfo';
import FeedSection from './components/FeedSection';
import { SectionDividerBox } from './CommunityFeed.styles';

const SectionDivider = () => <SectionDividerBox />;

const CommunityFeed = () => {
  return (
    <Box sx={{ p: 4 }}>
      {/* OOTD Section */}
      <FeedSection title="OOTD">
        {ootdItems.map((item) => (
          <Box key={item.id} sx={{ position: 'relative' }}>
            <OOTDImageContainer>
              <OOTDImage src={item.image} alt={item.label} />
              <OOTDLabel>{item.label}</OOTDLabel>
            </OOTDImageContainer>
            <PostMetrics likes={item.likes} comments={item.comments} />
          </Box>
        ))}
      </FeedSection>

      <SectionDivider />

      {/* Hot Posts Section */}
      <FeedSection title="Hot Posts">
        {hotPosts.map((post) => (
          <TextCard key={post.id}>
            <AuthorInfo author={post.author} avatar={post.avatar} />
            <Typography variant="h6">{post.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {post.content}
            </Typography>
            <PostMetrics likes={post.likes} comments={post.comments} />
          </TextCard>
        ))}
      </FeedSection>

      <SectionDivider />

      {/* Events Section */}
      <FeedSection title="Events">
        {events.map((event) => (
          <TextCard key={event.id}>
            <Typography variant="h6">{event.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {event.content}
            </Typography>
            <PostMetrics likes={event.likes} comments={event.comments} />
          </TextCard>
        ))}
      </FeedSection>
    </Box>
  );
};

export default CommunityFeed; 