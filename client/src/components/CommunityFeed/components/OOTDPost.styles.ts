import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const OOTDCard = styled(Box)({
  backgroundColor: '#fff',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  },
});

export const OOTDContent = styled(Box)({
  padding: '16px',
});

export const OOTDFooter = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 16px',
  borderTop: '1px solid rgba(0, 0, 0, 0.06)',
}); 