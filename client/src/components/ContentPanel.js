import React from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Import section components
import Values from './sections/Values';
import HotPosts from './sections/HotPosts';
import BestOutfit from './sections/BestOutfit';
import TodaysPoll from './sections/TodaysPoll';
import BrandDiscounts from './sections/BrandDiscounts';

const PanelContainer = styled(Box)({
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
});

const ContentContainer = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  padding: theme.spacing(3),
}));

const contentComponents = {
  values: Values,
  hot: HotPosts,
  outfit: BestOutfit,
  poll: TodaysPoll,
  event: BrandDiscounts,
};

const ContentPanel = ({ activeMenu }) => {
  const ActiveComponent = contentComponents[activeMenu];

  return (
    <PanelContainer>
      <AnimatePresence mode="wait">
        <ContentContainer
          key={activeMenu}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <ActiveComponent />
        </ContentContainer>
      </AnimatePresence>
    </PanelContainer>
  );
};

export default ContentPanel; 