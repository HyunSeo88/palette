import React from 'react';
import { SectionContainer, SectionTitle } from '../CommunityFeed.styles';
import { CardGrid } from '../../MainLayout/MainLayout.styles';

const FeedSection = ({ title, children }) => {
  return (
    <SectionContainer>
      <SectionTitle variant="h5">
        {title}
      </SectionTitle>
      <CardGrid>
        {children}
      </CardGrid>
    </SectionContainer>
  );
};

export default FeedSection; 