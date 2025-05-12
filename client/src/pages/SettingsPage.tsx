import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, Tabs, Tab, Alert, CircularProgress, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField as MuiTextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SecurityIcon from '@mui/icons-material/Security';
import GoogleIcon from '@mui/icons-material/Google';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import { useAuth, User } from '../contexts/AuthContext';
import { useGoogleLogin, TokenResponse as GoogleTokenResponse } from '@react-oauth/google';
import ProfileUpdateForm from '../components/settings/ProfileUpdateForm';
import PasswordChangeForm from '../components/settings/PasswordChangeForm';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Assuming api utility is available for direct use or create one
import BackButton from '../components/common/BackButton';

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

const LinkedAccountsPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(3),
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
  const { 
    user, 
    loading: authLoading, 
    deleteAccount, 
    socialLogin: authSocialLogin, // Get socialLogin from AuthContext
    refreshUserSession 
  } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  // State for social linking/unlinking
  const [isLinking, setIsLinking] = useState<string | null>(null); // 'google', 'kakao'
  const [linkError, setLinkError] = useState<string | null>(null);

  // Google login hook for linking
  const googleLinkLogin = useGoogleLogin({
    onSuccess: async (tokenResponse: Omit<GoogleTokenResponse, 'error' | 'error_description' | 'error_uri'>) => {
      console.log('[googleLinkLogin onSuccess] Received tokenResponse:', tokenResponse);
      const accessToken = tokenResponse.access_token;
      if (!accessToken) {
        const errMsg = 'Failed to get Google Access Token from tokenResponse.';
        console.error('[googleLinkLogin onSuccess]', errMsg, tokenResponse);
        setLinkError(errMsg);
        alert(errMsg);
        setIsLinking(null);
        return;
      }

      setIsLinking('google'); // Moved here, set before calling authSocialLogin
      try {
        console.log('[handleGoogleLink] Attempting to link Google account with access_token via authContext.socialLogin');
        // Use socialLogin from AuthContext
        const result = await authSocialLogin('google', accessToken, 'link');
        
        if (result.success) {
          alert(result.message || 'Google 계정이 성공적으로 연결되었습니다.');
          // refreshUserSession is implicitly called by checkAuth() within authSocialLogin
        } else {
          throw new Error(result.message || 'Google 계정 연결에 실패했습니다.');
        }
      } catch (error: any) {
        console.error('[handleGoogleLink] Google link API call error:', error.response?.data || error.message);
        const message = error.response?.data?.message || error.message || 'Google 계정 연결 중 오류가 발생했습니다.';
        setLinkError(message);
        alert(message);
      } finally {
        setIsLinking(null);
      }
    },
    onError: (errorResponse) => {
      console.error('[googleLinkLogin onError] Google login hook error:', errorResponse);
      const message = typeof errorResponse === 'string' ? errorResponse : errorResponse?.error_description || errorResponse?.error || 'Google 로그인 과정에서 오류가 발생했습니다.';
      setLinkError(message);
      alert(message);
      setIsLinking(null); // Reset isLinking state on error
    },
    // flow: 'implicit' is default and gives access_token. If ID token needed, flow might change or different hook/component.
    // For now, we are proceeding with access_token, assuming backend will be adapted.
  });

  type SocialProvider = 'google' | 'kakao';

  interface ButtonState {
    disabled: boolean;
    title: string;
    buttonText: string;
    buttonIcon: React.ReactElement;
    onClickAction?: () => void;
    color: "primary" | "secondary" | "error" | "inherit" | "success" | "info" | "warning";
    variant: "text" | "outlined" | "contained";
    isLoading: boolean;
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Define tabs
  const tabsConfig = [
    { label: '프로필 수정', icon: <AccountCircleIcon />, condition: true, content: <ProfileUpdateForm /> },
    { label: '연결된 계정', icon: <SecurityIcon />, condition: true, content: <LinkedAccountsPanel /> },
    { label: '비밀번호 변경', icon: <VpnKeyIcon />, condition: user?.provider === 'email', content: <PasswordChangeForm /> },
    { label: '계정 삭제', icon: <DeleteForeverIcon />, condition: true, content: <DangerZonePanel /> },
  ];

  const availableTabs = tabsConfig.filter(tab => tab.condition);


  // Handle hash links for direct tab access (e.g., /settings#change-password)
  useEffect(() => {
    const hash = window.location.hash;
    if (user) {
      if (user.provider === 'email' && hash === '#change-password') {
        const passwordTabIndex = availableTabs.findIndex(tab => tab.label === '비밀번호 변경');
        if (passwordTabIndex !== -1) setCurrentTab(passwordTabIndex);
      } else if (hash === '#linked-accounts') {
        const linkedAccountsTabIndex = availableTabs.findIndex(tab => tab.label === '연결된 계정');
        if (linkedAccountsTabIndex !== -1) setCurrentTab(linkedAccountsTabIndex);
      } else if (hash === '#danger-zone') {
        const dangerZoneTabIndex = availableTabs.findIndex(tab => tab.label === '계정 삭제');
        if (dangerZoneTabIndex !== -1) setCurrentTab(dangerZoneTabIndex);
      }
    }

    // Initialize Kakao SDK
    const kakaoJsKey = process.env.REACT_APP_KAKAO_JS_KEY;
    if (kakaoJsKey && !(window as any).Kakao?.isInitialized?.()) {
      const script = document.createElement('script');
      script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
      script.async = true;
      script.onload = () => {
        if ((window as any).Kakao) {
          (window as any).Kakao.init(kakaoJsKey);
          console.log('Kakao SDK initialized in SettingsPage');
        }
      };
      script.onerror = () => {
        console.error('Failed to load Kakao SDK script.');
      };
      document.head.appendChild(script);
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

  const handleGoogleLink = async () => {
    setLinkError(null);
    // setIsLinking('google'); // Moved to onSuccess of googleLinkLogin
    console.log('[handleGoogleLink] Calling googleLinkLogin() hook...');
    googleLinkLogin(); // This triggers the Google login flow
  };

  const handleKakaoLink = async () => {
    setLinkError(null);
    setIsLinking('kakao');
    try {
      const Kakao = (window as any).Kakao;
      if (!Kakao || !Kakao.Auth) {
        throw new Error('Kakao SDK가 로드되지 않았습니다.');
      }
      
      await new Promise<void>((resolve, reject) => {
        Kakao.Auth.login({
          success: async (authObj: any) => {
            console.log('[handleKakaoLink] Kakao login success:', authObj);
            const accessToken = authObj.access_token;
            if (!accessToken) {
              reject(new Error('카카오 액세스 토큰을 받지 못했습니다.'));
              return;
            }
            // Use socialLogin from AuthContext
            const result = await authSocialLogin('kakao', accessToken, 'link');
            if (result.success) {
              alert(result.message || '카카오 계정이 성공적으로 연결되었습니다.');
              // refreshUserSession is implicitly called by checkAuth() within authSocialLogin
              resolve();
            } else {
              reject(new Error(result.message || '카카오 계정 연결에 실패했습니다.'));
            }
          },
          fail: (err: any) => {
            console.error('[handleKakaoLink] Kakao login failed:', err);
            reject(new Error(err.error_description || err.message || '카카오 로그인에 실패했습니다.'));
          },
        });
      });
    } catch (error: any) {
      console.error('[handleKakaoLink] Kakao link error:', error);
      const message = error.message || '카카오 계정 연결 중 오류가 발생했습니다.';
      setLinkError(message);
      alert(message);
    } finally {
      setIsLinking(null);
    }
  };
  
  const handleUnlinkSocial = async (providerToUnlink: SocialProvider) => {
    setLinkError(null);
    setIsLinking(providerToUnlink); // Indicate process for this provider
    try {
      // TODO: Implement backend for unlinking.
      // For now, this is a placeholder.
      // const response = await api.post(`/users/me/unlink-social`, { provider: providerToUnlink });
      // if (response.data.success) {
      //   alert(`${providerToUnlink} 계정 연결이 해제되었습니다.`);
      //   await refreshUserSession(); 
      // } else {
      //   throw new Error(response.data.message || `${providerToUnlink} 계정 연결 해제에 실패했습니다.`);
      // }
      alert(`'${providerToUnlink}' 계정 연결 해제 기능은 현재 준비 중입니다.`);
      console.warn(`Unlink functionality for ${providerToUnlink} is not yet implemented.`);
    } catch (error: any) {
      console.error(`[handleUnlinkSocial ${providerToUnlink}] API call error:`, error.response?.data || error.message);
      const message = error.response?.data?.message || error.message || `${providerToUnlink} 계정 연결 해제 중 오류가 발생했습니다.`;
      setLinkError(message);
      alert(message);
    } finally {
      setIsLinking(null); // Reset isLinking state here after API call
    }
  };

  const getLinkButtonState = (
    targetProvider: SocialProvider
  ): ButtonState => {
    const isLinked = user?.socialLinks?.some(link => link.provider === targetProvider);
    const isLoadingThis = isLinking === targetProvider;

    if (isLinked) {
      return {
        disabled: isLoadingThis || isLinking !== null, // Disable if any linking process is ongoing
        title: `${targetProvider} 계정 연결 해제`,
        buttonText: `${targetProvider.charAt(0).toUpperCase() + targetProvider.slice(1)} 연결 해제`,
        buttonIcon: <LinkOffIcon />,
        onClickAction: () => handleUnlinkSocial(targetProvider),
        color: 'error',
        variant: 'outlined',
        isLoading: isLoadingThis,
      };
    } else {
      // Check if another social account of the *same type* is linked to a *different* Palette account
      // This check is now primarily handled by the backend during the link attempt.
      // Frontend can provide a general link button.
      return {
        disabled: isLoadingThis || isLinking !== null, // Disable if any linking process is ongoing
        title: `${targetProvider} 계정 연결`,
        buttonText: `${targetProvider.charAt(0).toUpperCase() + targetProvider.slice(1)} 계정 연결`,
        buttonIcon: targetProvider === 'google' ? <GoogleIcon /> : <LinkIcon />, // Kakao doesn't have a standard MUI icon
        onClickAction: targetProvider === 'google' ? handleGoogleLink : handleKakaoLink,
        color: 'primary',
        variant: 'contained',
        isLoading: isLoadingThis,
      };
    }
  };

  if (authLoading || !user) {
    return (
        <StyledContainer maxWidth="md">
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        </StyledContainer>
    );
  }

  // Panel for Linked Accounts
  function LinkedAccountsPanel() {
    if (!user) return null;

    const googleButtonState = getLinkButtonState('google');
    // Kakao button state - assuming Kakao icon is available or a generic one is used
    const kakaoButtonState = getLinkButtonState('kakao');

    return (
      <Box>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          연결된 소셜 계정
        </Typography>
        {linkError && <Alert severity="error" sx={{ mb: 2 }}>{linkError}</Alert>}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
          {/* Google Link/Unlink Button */}
          <Button
            variant={googleButtonState.variant}
            color={googleButtonState.color}
            startIcon={googleButtonState.isLoading ? <CircularProgress size={20} color="inherit" /> : googleButtonState.buttonIcon}
            onClick={googleButtonState.onClickAction}
            disabled={googleButtonState.disabled}
            title={googleButtonState.title}
            fullWidth
            sx={{ justifyContent: 'flex-start', py: 1.5 }}
          >
            {googleButtonState.buttonText}
          </Button>

          {/* Kakao Link/Unlink Button */}
          <Button
            variant={kakaoButtonState.variant}
            color={kakaoButtonState.color}
            startIcon={kakaoButtonState.isLoading ? <CircularProgress size={20} color="inherit" /> : kakaoButtonState.buttonIcon}
            onClick={kakaoButtonState.onClickAction}
            disabled={kakaoButtonState.disabled}
            title={kakaoButtonState.title}
            fullWidth
            sx={{ justifyContent: 'flex-start', py: 1.5 }}
          >
            {kakaoButtonState.buttonText}
          </Button>
        </Box>

        {user.socialLinks && user.socialLinks.length > 0 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom sx={{mt: 3}}>현재 연결된 계정:</Typography>
            {user.socialLinks.map(link => (
              <Paper key={link.provider} elevation={1} sx={{ p: 2, mb: 1, display: 'flex', alignItems: 'center' }}>
                {link.provider === 'google' ? <GoogleIcon sx={{ mr: 1 }} /> : <LinkIcon sx={{ mr: 1 }} />}
                <Typography>
                  {link.provider.charAt(0).toUpperCase() + link.provider.slice(1)}: {link.email || '이메일 정보 없음'} (ID: ...{link.socialId.slice(-6)})
                </Typography>
              </Paper>
            ))}
          </Box>
        )}
         {(!user.socialLinks || user.socialLinks.length === 0) && (
          <Typography sx={{mt: 2, color: 'text.secondary'}}>연결된 소셜 계정이 없습니다.</Typography>
        )}
      </Box>
    );
  }

  // Panel for Danger Zone (Account Deletion)
  function DangerZonePanel() {
    return (
      <Box>
        <Typography variant="h6" gutterBottom sx={{ color: 'error.main' }}>
          위험 구역
        </Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteForeverIcon />}
          onClick={handleDeleteModalOpen}
        >
          회원 탈퇴
        </Button>
        {/* Delete Account Modal */}
        <Dialog open={deleteModalOpen} onClose={handleDeleteModalClose}>
          <DialogTitle>회원 탈퇴 확인</DialogTitle>
          <DialogContent>
            <DialogContentText>
              정말로 회원 탈퇴를 진행하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든 사용자 데이터가 영구적으로 삭제됩니다.
              {user?.provider === 'email' && "계속하려면 현재 비밀번호를 입력해주세요."}
            </DialogContentText>
            {user?.provider === 'email' && (
              <MuiTextField
                autoFocus
                margin="dense"
                id="password"
                label="현재 비밀번호"
                type="password"
                fullWidth
                variant="standard"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                error={!!deleteError}
                helperText={deleteError}
              />
            )}
            {isDeleting && <CircularProgress sx={{ display: 'block', margin: '10px auto' }} />}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteModalClose} disabled={isDeleting}>취소</Button>
            <Button onClick={handleConfirmDelete} color="error" disabled={isDeleting}>
              {isDeleting ? '삭제 중...' : '회원 탈퇴'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }


  return (
    <StyledContainer maxWidth="md">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <BackButton />
        <Typography variant="h4" component="h1" sx={{ ml: 1 }}>
          계정 설정
        </Typography>
      </Box>
      <StyledPaper elevation={2}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="settings tabs" variant="scrollable" scrollButtons="auto">
            {availableTabs.map((tab, index) => (
              <Tab key={tab.label} label={tab.label} icon={tab.icon} iconPosition="start" {...a11yProps(index)} />
            ))}
          </Tabs>
        </Box>
        {availableTabs.map((tab, index) => (
          <TabPanel key={tab.label} value={currentTab} index={index}>
            {tab.content}
          </TabPanel>
        ))}
      </StyledPaper>
    </StyledContainer>
  );
};

export default SettingsPage;
