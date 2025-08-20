import React from 'react';
import { Box, IconButton } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { CAROUSEL_NAVIGATION_BUTTON_SIZE } from '../../../../constants/animations';

export interface CarouselNavigationProps {
  onNext: () => void;
  onPrev: () => void;
  isDisabled?: boolean;
  showNavigation?: boolean;
}

/**
 * Carousel Navigation Component
 * Following @frontend.mdc guidelines: Separate conditional rendering into distinct components
 */
const CarouselNavigation: React.FC<CarouselNavigationProps> = React.memo(({
  onNext,
  onPrev,
  isDisabled = false,
  showNavigation = true,
}) => {
  if (!showNavigation) return null;

  const buttonStyles = {
    width: CAROUSEL_NAVIGATION_BUTTON_SIZE,
    height: CAROUSEL_NAVIGATION_BUTTON_SIZE,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
    },
    '&:disabled': {
      opacity: 0.5,
    },
  };

  const iconStyles = {
    fontSize: 20,
    color: 'rgba(0, 0, 0, 0.8)',
  };

  return (
    <>
      {/* 이전 버튼 */}
      <Box
        sx={{
          position: 'absolute',
          left: { xs: 8, sm: 16, md: 24 },
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
        }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <IconButton
            onClick={onPrev}
            disabled={isDisabled}
            sx={buttonStyles}
          >
            <ArrowBackIosNew sx={{ ...iconStyles, ml: 0.5 }} />
          </IconButton>
        </motion.div>
      </Box>

      {/* 다음 버튼 */}
      <Box
        sx={{
          position: 'absolute',
          right: { xs: 8, sm: 16, md: 24 },
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
        }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <IconButton
            onClick={onNext}
            disabled={isDisabled}
            sx={buttonStyles}
          >
            <ArrowForwardIos sx={iconStyles} />
          </IconButton>
        </motion.div>
      </Box>
    </>
  );
});

CarouselNavigation.displayName = 'CarouselNavigation';

export default CarouselNavigation; 