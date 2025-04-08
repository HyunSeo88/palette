import React from 'react';
import { Box } from '@mui/material';
import {
  FeedSection,
  OOTDGrid,
  TextContentGrid,
  SectionTitleContainer,
  SectionTitle
} from '../MainLayout/MainLayout.styles';
import TextPost from './components/TextPost';
import OOTDPost from './components/OOTDPost';
import { ootdItems, hotPosts, events } from '../../data/feedData';

const CommunityFeed = () => {
  return (
    <Box>
      {/* Hot Posts Section */}
      <FeedSection>
        <SectionTitleContainer>
          <SectionTitle>Hot 게시물</SectionTitle>
        </SectionTitleContainer>
        <TextContentGrid>
          {hotPosts.map((post) => (
            <TextPost key={post.id} {...post} />
          ))}
        </TextContentGrid>
      </FeedSection>

      {/* OOTD Section */}
      <FeedSection>
        <SectionTitleContainer>
          <SectionTitle>오늘의 코디</SectionTitle>
        </SectionTitleContainer>
        <OOTDGrid>
          {ootdItems.map((item) => (
            <OOTDPost key={item.id} {...item} />
          ))}
        </OOTDGrid>
      </FeedSection>

      {/* Events Section */}
      <FeedSection>
        <SectionTitleContainer>
          <SectionTitle>이벤트 소식</SectionTitle>
        </SectionTitleContainer>
        <TextContentGrid>
          {events.map((event) => (
            <TextPost key={event.id} {...event} />
          ))}
        </TextContentGrid>
      </FeedSection>
    </Box>
  );
};

export default CommunityFeed; 