import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

export interface CarouselIndicatorsProps {
  totalItems: number;
  currentIndex: number;
  onIndicatorClick: (index: number) => void;
  showIndicators?: boolean;
  maxIndicators?: number;
}

/**
 * Carousel Indicators Component
 * Following @frontend.mdc guidelines: Keep related code together for cohesion
 */
const CarouselIndicators: React.FC<CarouselIndicatorsProps> = React.memo(({
  totalItems,
  currentIndex,
  onIndicatorClick,
  showIndicators = true,
  maxIndicators = 5,
}) => {
  if (!showIndicators || totalItems <= 1 || totalItems > maxIndicators) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 1.5,
        zIndex: 10,
      }}
    >
      {Array.from({ length: totalItems }, (_, index) => (
        <motion.button
          key={index}
          onClick={() => onIndicatorClick(index)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: index === currentIndex ? 28 : 10,
            height: 10,
            borderRadius: 5,
            border: 'none',
            backgroundColor: index === currentIndex 
              ? 'rgba(0, 0, 0, 0.8)' 
              : 'rgba(0, 0, 0, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        />
      ))}
    </Box>
  );
});

CarouselIndicators.displayName = 'CarouselIndicators';

export default CarouselIndicators; 