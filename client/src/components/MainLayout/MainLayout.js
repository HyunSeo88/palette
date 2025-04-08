import React from 'react';
import { Box } from '@mui/material';
import { LeftPanel, RightPanel, LayoutContainer, TopDynamicArea } from './MainLayout.styles';
import LeftPanelContent from '../LeftPanelContent/LeftPanelContent';
import CommunityFeed from '../CommunityFeed/CommunityFeed';

const MainLayout = () => {
  return (
    <LayoutContainer>
      <TopDynamicArea>
        <LeftPanel>
          <LeftPanelContent />
        </LeftPanel>
        <RightPanel>
          <CommunityFeed />
        </RightPanel>
      </TopDynamicArea>
    </LayoutContainer>
  );
};

export default MainLayout;