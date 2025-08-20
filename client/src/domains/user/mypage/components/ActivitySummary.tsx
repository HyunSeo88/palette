import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { IActivitySummary } from '../../../../types/user';
import { 
  ANIMATION_DURATION_STANDARD,
  APPLE_EASING,
  STAGGER_DELAY_STANDARD 
} from '../../../../constants/animations';

interface ActivitySummaryProps {
  activitySummary: IActivitySummary;
}

const SummaryCard = styled(motion.div)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
  }
}));

const StatItem = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 0),
  borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
  '&:last-child': {
    borderBottom: 'none',
  }
}));

const StatValue = styled(Typography)({
  fontSize: '1.4rem',
  fontWeight: 600,
  color: '#007aff',
});

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION_STANDARD,
      staggerChildren: STAGGER_DELAY_STANDARD,
      ease: APPLE_EASING
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION_DURATION_STANDARD,
      ease: APPLE_EASING
    }
  }
};

const ActivitySummary: React.FC<ActivitySummaryProps> = ({ activitySummary }) => {
  return (
    <SummaryCard
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <Typography 
        variant="h5" 
        sx={{ 
          fontSize: { xs: '1.4rem', sm: '1.6rem' },
          fontWeight: 600,
          color: '#1d1d1f',
          letterSpacing: '-0.01em',
          mb: 3
        }}
      >
        Activity Summary
      </Typography>

      <Box>
        <StatItem variants={itemVariants}>
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: '1.1rem',
              fontWeight: 500,
              color: '#1d1d1f'
            }}
          >
            Total Posts
          </Typography>
          <StatValue>{activitySummary.totalPosts}</StatValue>
        </StatItem>

        <StatItem variants={itemVariants}>
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: '1.1rem',
              fontWeight: 500,
              color: '#1d1d1f'
            }}
          >
            Total Comments
          </Typography>
          <StatValue>{activitySummary.totalComments}</StatValue>
        </StatItem>

        {Object.keys(activitySummary.postsByType).length > 0 && (
          <>
            <Box sx={{ mt: 3, mb: 2 }}>
              <Typography 
                variant="h6" 
                sx={{
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  color: '#1d1d1f',
                  letterSpacing: '-0.01em'
                }}
              >
                Posts by Type
              </Typography>
            </Box>
            {Object.entries(activitySummary.postsByType).map(([type, count]) => (
              <StatItem key={type} variants={itemVariants}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    color: '#1d1d1f',
                    textTransform: 'capitalize'
                  }}
                >
                  {type}
                </Typography>
                <StatValue>{count}</StatValue>
              </StatItem>
            ))}
          </>
        )}
      </Box>
    </SummaryCard>
  );
};

export default ActivitySummary; 