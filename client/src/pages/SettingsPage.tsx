import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const SettingsPage: React.FC = () => {
  return (
    <StyledContainer maxWidth="md">
      <StyledPaper>
        <Typography variant="h4" gutterBottom>
          설정
        </Typography>
        {/* 설정 컴포넌트들이 여기에 추가될 예정입니다 */}
      </StyledPaper>
    </StyledContainer>
  );
};

export default SettingsPage; 