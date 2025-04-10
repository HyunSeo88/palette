import { styled } from '@mui/material/styles';
import { Box, Theme } from '@mui/material';
import { COMMON_STYLES } from '../../../theme';

// Constants
const COLORS = {
  white: '#fff',
  border: 'rgba(0, 0, 0, 0.06)',
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.15)'
  }
} as const;

const SPACING = {
  small: '12px',
  medium: '16px'
} as const;

const TRANSITIONS = {
  hover: 'transform 0.2s ease, box-shadow 0.2s ease'
} as const;

/**
 * Main container for OOTD post
 * Provides card-like appearance with hover effects
 */
export const OOTDCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: COMMON_STYLES.card.borderRadius,
  boxShadow: COMMON_STYLES.card.boxShadow,
  transition: COMMON_STYLES.card.transition,
  overflow: 'hidden',
  '&:hover': COMMON_STYLES.card.hover,
}));

export const OOTDImageContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  paddingTop: '100%', // 1:1 Aspect ratio
  overflow: 'hidden',
});

export const OOTDImage = styled('img')({
  width: '100%',
  height: 'auto',
  aspectRatio: '1',
  objectFit: 'cover',
  borderRadius: '8px 8px 0 0',
});

export const OOTDLabel = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  padding: theme.spacing(0.5, 1.5),
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius,
  fontSize: '0.875rem',
  fontWeight: 500,
}));

/**
 * Container for post content (author info and title)
 */
export const OOTDContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

/**
 * Container for post metrics (likes, comments)
 */
export const OOTDFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
})); 