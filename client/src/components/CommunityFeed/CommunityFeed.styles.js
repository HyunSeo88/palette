import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const SectionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 600,
}));

export const SectionDividerBox = styled(Box)(({ theme }) => ({
  height: '1px',
  backgroundColor: theme.palette.divider,
  margin: theme.spacing(4, 0),
})); 