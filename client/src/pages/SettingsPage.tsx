import React, { useState } from 'react';
import { Container, Typography, Paper, Box, Tabs, Tab, Alert, CircularProgress, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField as MuiTextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useAuth } from '../contexts/AuthContext';
import ProfileUpdateForm from '../components/settings/ProfileUpdateForm';
import PasswordChangeForm from '../components/settings/PasswordChangeForm';
import { useNavigate } from 'react-router-dom';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(0, 3, 3, 3), // Adjusted padding for Tabs
}));

const DangerZonePaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(3),
  borderColor: theme.palette.error.main,
  borderWidth: 1,
  borderStyle: 'solid',
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}> {/* Add padding top for tab content */}
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

const SettingsPage: React.FC = () => {
  const { user, loading: authLoading, deleteAccount } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Handle hash links for direct tab access (e.g., /settings#change-password)
  React.useEffect(() => {
    const hash = window.location.hash;
    if (user && user.provider === 'email' && hash === '#change-password') {
      setCurrentTab(1); // Index of Password Change tab
    }
  }, [user]); // Run when user object is available

  const handleDeleteModalOpen = () => {
    setDeleteModalOpen(true);
    setDeleteError(null); // Reset error on modal open
    setDeletePassword(''); // Reset password on modal open
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (user && user.provider === 'email' && !deletePassword) {
      setDeleteError('계정 삭제를 위해 현재 비밀번호를 입력해주세요.');
      return;
    }
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const result = await deleteAccount(user?.provider === 'email' ? deletePassword : undefined);
      if (result.success) {
        setDeleteModalOpen(false);
        alert('회원 탈퇴가 완료되었습니다.'); // 임시 알림
        navigate('/'); // 홈으로 리디렉션
      } else {
        setDeleteError(result.message || '계정 삭제에 실패했습니다.');
      }
    } catch (error: any) {
      setDeleteError(error.message || '계정 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading && !user) {
    return (
        <StyledContainer maxWidth="md">
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        </StyledContainer>
    );
  }

  if (!user) {
    return (
        <StyledContainer maxWidth="md">
            <Alert severity="warning">설정 페이지에 접근하려면 먼저 로그인해주세요.</Alert>
        </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        계정 설정
      </Typography>
      <StyledPaper>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="account settings tabs" variant="fullWidth">
            <Tab label="프로필 수정" icon={<AccountCircleIcon />} iconPosition="start" {...a11yProps(0)} />
            {user.provider === 'email' && (
              <Tab label="비밀번호 변경" icon={<VpnKeyIcon />} iconPosition="start" {...a11yProps(1)} />
            )}
          </Tabs>
        </Box>
        <TabPanel value={currentTab} index={0}>
          <ProfileUpdateForm />
        </TabPanel>
        {user.provider === 'email' && (
          <TabPanel value={currentTab} index={1}>
            <PasswordChangeForm />
          </TabPanel>
        )}
      </StyledPaper>

      {/* 계정 삭제 섹션 */}
      <DangerZonePaper variant="outlined">
        <Typography variant="h6" gutterBottom color="error">
          위험 구역
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          계정을 삭제하면 모든 데이터가 영구적으로 제거되며 복구할 수 없습니다. 신중하게 결정해주세요.
        </Typography>
        <Button 
          variant="contained" 
          color="error" 
          startIcon={<DeleteForeverIcon />} 
          onClick={handleDeleteModalOpen}
          disabled={isDeleting}
        >
          {isDeleting ? <CircularProgress size={24} color="inherit" /> : '회원 탈퇴'}
        </Button>
      </DangerZonePaper>

      {/* 계정 삭제 확인 모달 */}
      <Dialog open={deleteModalOpen} onClose={handleDeleteModalClose}>
        <DialogTitle>회원 탈퇴 확인</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: user?.provider === 'email' ? 2 : 0 }}>
            정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </DialogContentText>
          {user?.provider === 'email' && (
            <MuiTextField
              autoFocus
              margin="dense"
              id="password-confirm-delete"
              label="현재 비밀번호 확인"
              type="password"
              fullWidth
              variant="standard"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              error={!!deleteError && deletePassword === ''} // 비밀번호 필드가 비어있을 때만 에러 강조
            />
          )}
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>{deleteError}</Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteModalClose} disabled={isDeleting}>취소</Button>
          <Button onClick={handleConfirmDelete} color="error" disabled={isDeleting} variant="contained">
            {isDeleting ? <CircularProgress size={24} color="inherit" /> : '탈퇴 확인'}
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default SettingsPage;
