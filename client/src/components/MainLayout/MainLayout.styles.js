import { styled } from '@mui/material/styles';
import { Box, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export const LayoutContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'relative',
}));

export const TopDynamicArea = styled(Box)(({ theme }) => ({
  height: '100vh',
  width: '100%',
  display: 'flex',
  position: 'fixed',
  top: 0,
  left: 0,
  backgroundColor: theme.palette.background.paper,
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    height: 'auto',
    position: 'relative',
  },
}));

export const LeftPanel = styled(Box)(({ theme }) => ({
  width: '35%',
  height: '100vh',
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRight: `1px solid ${theme.palette.divider}`,
  position: 'relative',
  backgroundColor: theme.palette.background.default,

  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: 'auto',
    padding: theme.spacing(2),
    borderRight: 'none',
    borderBottom: `1px solid ${theme.palette.divider}`,
    justifyContent: 'flex-start',
  },
}));

export const RightPanel = styled(Box)(({ theme }) => ({
  width: '65%',
  height: '100vh',
  padding: theme.spacing(4),
  overflowY: 'auto',
  position: 'relative',

  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: 'auto',
    padding: theme.spacing(2),
    overflowY: 'visible',
  },
}));

export const FeedSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 0),
  backgroundColor: theme.palette.background.default,
  marginTop: '100vh',
  position: 'relative',
  zIndex: 1,

  [theme.breakpoints.down('md')]: {
    marginTop: 0,
  },
}));

export const ContentSection = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isScrolled',
})(({ theme, isScrolled }) => ({
  flex: 1,
  width: '100%',
  position: 'relative',
  backgroundColor: theme.palette.background.default,
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.background.paper,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[300],
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: theme.palette.grey[400],
    },
  },
}));

export const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const PaletteIconWrapper = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  color: theme.palette.primary.main,
  
  [theme.breakpoints.down('sm')]: {
    width: '40px',
    height: '40px',
  },
}));

export const GradientText = styled(motion(Typography))(({ theme }) => ({
  backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  fontWeight: 'bold',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  letterSpacing: '0.5px',
}));

export const MenuInfoContainer = styled(motion.div)(({ theme }) => ({
  marginTop: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  width: '100%',
  maxWidth: '400px',
}));

export const MenuIconWrapper = styled(motion.div)(({ theme, color }) => ({
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: color,
  color: theme.palette.getContrastText(color || theme.palette.primary.main),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '24px',
  boxShadow: `0 4px 12px ${(color || theme.palette.primary.main)}80`,
}));

export const ContentCard = styled(motion(Paper))(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  overflow: 'hidden',
  height: '100%',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
  },
}));

export const MenuContentContainer = styled(motion.div)({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  gap: '1rem',
});

export const CardGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(3),
  
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(4),
  fontWeight: 700,
  display: 'inline-block',
  
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 60,
    height: 4,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 2,
  },
}));

export const CardImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '180px',
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
}));

export const VoteContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

export const VoteOption = styled(Box)(({ theme, isSelected }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: isSelected ? theme.palette.primary.light : theme.palette.grey[100],
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: `1px solid ${isSelected ? theme.palette.primary.main : 'transparent'}`,
  '&:hover': {
    backgroundColor: isSelected ? theme.palette.primary.light : theme.palette.grey[200],
  },
  gap: theme.spacing(1.5),
}));

export const FeedCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
})); 