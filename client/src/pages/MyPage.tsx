import React from 'react';
import { Container, Typography, Paper, Box, Avatar, Button, CircularProgress, Alert, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  marginBottom: theme.spacing(2),
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1.5),
  width: '100%',
  maxWidth: '400px',
  '& svg': {
    marginRight: theme.spacing(1.5),
    color: theme.palette.text.secondary,
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  width: '100%',
}));

const MyPage: React.FC = () => {
  const { user, loading, error } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <StyledContainer maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer maxWidth="md">
        <Alert severity="error">사용자 정보를 불러오는 중 오류가 발생했습니다: {error}</Alert>
      </StyledContainer>
    );
  }

  if (!user) {
    return (
      <StyledContainer maxWidth="md">
        <Alert severity="warning">
          사용자 정보를 찾을 수 없습니다. <Button component={RouterLink} to="/login">로그인</Button>해주세요.
        </Alert>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="sm">
      <StyledPaper>
        <IconButton 
          onClick={() => navigate(-1)} 
          sx={{ position: 'absolute', top: theme => theme.spacing(2), left: theme => theme.spacing(2) }}
          aria-label="뒤로 가기"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mt: 2 }}>
          마이페이지
        </Typography>
        
        <ProfileAvatar src={user.photoURL || undefined} alt={user.nickname || '사용자'} >
          {!user.photoURL && user.nickname ? user.nickname.charAt(0).toUpperCase() : !user.photoURL && <PersonIcon />}
        </ProfileAvatar>
        
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          {user.nickname}
        </Typography>

        <Box sx={{ mb: 3, width: '100%', maxWidth: '400px' }}>
          <InfoRow>
            <EmailIcon />
            <Typography variant="body1">{user.email}</Typography>
          </InfoRow>
          {user.bio && (
            <InfoRow>
              <PersonIcon />
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{user.bio}</Typography>
            </InfoRow>
          )}
          <InfoRow>
            <Typography variant="caption" color="textSecondary">가입 방식: {user.provider || '알 수 없음'}</Typography>
          </InfoRow>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%', maxWidth: '300px' }}>
          <ActionButton
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => navigate('/settings')}
          >
            프로필 수정
          </ActionButton>
          {user.provider === 'email' && (
             <ActionButton
              variant="outlined"
              color="secondary"
              startIcon={<LockResetIcon />}
              onClick={() => navigate('/settings#change-password')}
            >
              비밀번호 변경
            </ActionButton>
          )}
        </Box>

      </StyledPaper>
    </StyledContainer>
  );
};

export default MyPage; 