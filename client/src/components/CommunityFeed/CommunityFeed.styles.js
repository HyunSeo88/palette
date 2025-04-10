import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const FeedContainer = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '24px',
  padding: '24px',
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
});

export const SectionContainer = styled(Box)({
  marginBottom: '48px',
  '&:last-child': {
    marginBottom: 0,
  },
});

export const SectionTitle = styled(Typography)({
  fontSize: '24px',
  fontWeight: 600,
  marginBottom: '24px',
  color: '#2D3748',
});

export const SectionDividerBox = styled(Box)({
  height: '1px',
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  margin: '32px 0',
}); 