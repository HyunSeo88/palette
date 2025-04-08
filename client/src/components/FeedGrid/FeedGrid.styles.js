import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// Container for the Masonry grid itself
export const GridContainer = styled(Box)(({ theme }) => ({
  // No specific styles needed here if Masonry library handles positioning
  // margin: '0 auto', // Uncomment if using fitWidth in Masonry options for centering
}));

// Represents each item in the grid (used for sizing and spacing)
export const GridItem = styled(Box)(({ theme }) => ({
  width: 'calc(25% - 12px)', // Example: 4 columns with 16px gutter (16 * 3/4 = 12px)
  marginBottom: theme.spacing(2), // Gutter bottom
  // Adjust width based on breakpoints for responsive columns
  [theme.breakpoints.down('lg')]: {
    width: 'calc(33.333% - 11px)', // 3 columns (16 * 2/3 approx 11px)
  },
  [theme.breakpoints.down('md')]: {
    width: 'calc(50% - 8px)', // 2 columns (16 * 1/2 = 8px)
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%', // 1 column
    marginBottom: theme.spacing(1.5),
  },
})); 