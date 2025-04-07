import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

export const MenuContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 400,
  aspectRatio: '1',
  position: 'relative',
  marginBottom: theme.spacing(4),
}));

export const PaletteWrapper = styled(motion.div)({
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const PaletteSegment = styled(motion.path)(({ color, isActive }) => ({
  fill: color,
  stroke: '#fff',
  strokeWidth: 1,
  cursor: 'pointer',
  opacity: isActive ? 1 : 0.8,
  transition: 'opacity 0.2s ease',
  '&:hover': {
    opacity: 0.9,
  },
}));

export const CenterCircle = styled('circle')({
  fill: '#fff',
  pointerEvents: 'none',
});

export const MenuInfo = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  bottom: -80,
  left: '50%',
  transform: 'translateX(-50%)',
  textAlign: 'center',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

export const IconWrapper = styled(motion.div)(({ color }) => ({
  width: 48,
  height: 48,
  borderRadius: '50%',
  backgroundColor: color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
})); 