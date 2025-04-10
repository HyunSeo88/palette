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
import { SectionDividerBox, FeedContainer } from './CommunityFeed.styles';
import TextPost from './components/TextPost';
import OOTDPost from './components/OOTDPost';

const SectionDivider = () => <SectionDividerBox />;

interface CommunityFeedProps {
  sectionType?: 'hot-posts' | 'ootd' | 'voting' | 'events';
}

const CommunityFeed: React.FC<CommunityFeedProps> = ({ sectionType }) => {
  const renderContent = () => {
    switch (sectionType) {
      case 'ootd':
        return (
          <>
            <OOTDPost />
            <OOTDPost />
            <OOTDPost />
          </>
        );
      case 'hot-posts':
      case 'voting':
      case 'events':
        return (
          <>
            <TextPost />
            <TextPost />
            <TextPost />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <FeedContainer>
      {renderContent()}
    </FeedContainer>
  );
};

export default CommunityFeed; 