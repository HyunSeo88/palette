import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const CardWrapper = styled(Box)(({ theme }) => ({
  width: '100%', // Ensure card takes full width of GridItem
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  position: 'relative',
  boxShadow: theme.shadows[2],
  backgroundColor: theme.palette.background.paper,
  cursor: 'pointer',
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[6],
    '& .card-overlay': {
      opacity: 1,
    },
  },
}));

export const ImageContainer = styled(Box)({
  position: 'relative',
  display: 'block', // Ensure container behaves correctly for image
});

export const StyledImage = styled('img')({
  display: 'block', // Remove extra space below image
  width: '100%',
  height: 'auto', // Adjust height automatically
  objectFit: 'cover', // Cover the container, might crop
});

export const Overlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5),
}));

export const TopActions = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
});

export const BottomInfo = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
});

export const AuthorInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
}); 