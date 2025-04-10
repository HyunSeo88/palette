import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const MyPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <StyledContainer maxWidth="md">
      <StyledPaper>
        <Typography variant="h4" gutterBottom>
          마이페이지
        </Typography>
        <Typography variant="body1">
          {user?.nickname || '사용자'} 님, 환영합니다!
        </Typography>
        {/* 사용자 정보 및 설정 컴포넌트들이 여기에 추가될 예정입니다 */}
      </StyledPaper>
    </StyledContainer>
  );
};

export default MyPage; 