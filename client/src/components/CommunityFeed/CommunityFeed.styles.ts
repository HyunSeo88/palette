import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

// Constants
const SPACING = {
  small: '24px',
  medium: '32px',
  large: '48px',
} as const;

const COLORS = {
  title: '#2D3748',
  divider: 'rgba(0, 0, 0, 0.1)',
} as const;

const LAYOUT = {
  maxWidth: '1200px',
  minColumnWidth: '280px',
} as const;

const TYPOGRAPHY = {
  sectionTitle: {
    size: '24px',
    weight: 600,
  },
} as const;

/**
 * Main container for the feed content
 * Uses CSS Grid for responsive layout
 */
export const FeedContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: theme.spacing(3),
  padding: theme.spacing(3),
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
}));

/**
 * Container for each feed section
 * Provides consistent spacing between sections
 */
export const SectionContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  width: '100%',
}));

/**
 * Typography component for section titles
 * Maintains consistent styling across sections
 */
export const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontWeight: 600,
}));

/**
 * Divider component between sections
 * Provides visual separation with consistent spacing
 */
export const SectionDividerBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '1px',
  backgroundColor: theme.palette.divider,
  margin: `${theme.spacing(3)} 0`,
}));

export const EmptyFeedMessage = styled(Typography)(({ theme }) => ({
  width: '100%',
  textAlign: 'center',
  padding: theme.spacing(4),
  color: theme.palette.text.secondary,
  fontSize: '1rem',
  gridColumn: '1 / -1',
})); 