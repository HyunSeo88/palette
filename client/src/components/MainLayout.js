import React from 'react';
import { Box, Container, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Values from './sections/Values';
import HotPosts from './sections/HotPosts';
import BestOutfit from './sections/BestOutfit';
import TodaysPoll from './sections/TodaysPoll';
import BrandDiscounts from './sections/BrandDiscounts';

const MainContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
}));

const SectionWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(6),
  '&:last-child': {
    marginBottom: 0,
  },
}));

const MainLayout = () => {
  return (
    <MainContainer maxWidth="lg">
      <Grid container spacing={4}>
        {/* Values Section - Full Width */}
        <Grid item xs={12}>
          <SectionWrapper>
            <Values />
          </SectionWrapper>
        </Grid>

        {/* Left Column - Hot Posts and Best Outfit */}
        <Grid item xs={12} md={8}>
          <SectionWrapper>
            <HotPosts />
          </SectionWrapper>
          <SectionWrapper>
            <BestOutfit />
          </SectionWrapper>
        </Grid>

        {/* Right Column - Today's Poll */}
        <Grid item xs={12} md={4}>
          <SectionWrapper>
            <TodaysPoll />
          </SectionWrapper>
        </Grid>

        {/* Brand Discounts Section - Full Width */}
        <Grid item xs={12}>
          <SectionWrapper>
            <BrandDiscounts />
          </SectionWrapper>
        </Grid>
      </Grid>
    </MainContainer>
  );
};

export default MainLayout; 