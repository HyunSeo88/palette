import { styled } from '@mui/material/styles';
import { Box, Card, CardMedia, CardContent } from '@mui/material';
import { motion } from 'framer-motion';

export const ScrollContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '60vh',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
}));

export const ContentCard = styled(motion(Card))(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease-in-out',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(2),
  },
}));

export const CardImageWrapper = styled(CardMedia)(({ theme }) => ({
  paddingTop: '56.25%', // 16:9 aspect ratio
  position: 'relative',
  backgroundColor: theme.palette.grey[200],
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  [theme.breakpoints.down('sm')]: {
    paddingTop: '75%', // 4:3 aspect ratio for mobile
  },
}));

export const CardContentWrapper = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(3),
    '&:last-child': {
      paddingBottom: theme.spacing(3),
    },
  },
}));

export const LoadingContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '60vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

export const ErrorContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '60vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  backgroundColor: theme.palette.error.light,
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.error.main,
  '& svg': {
    color: theme.palette.error.main,
  },
})); 