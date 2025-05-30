import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppTheme } from './theme';
import { useAuth } from './contexts/AuthContext';
import MainLayout from './components/MainLayout/MainLayout';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import EmailVerification from './components/auth/EmailVerification';
import SocialOnboardingPage from './pages/SocialOnboardingPage';
import SocialEmailRequestPage from './pages/SocialEmailRequestPage';

const App: React.FC = () => {
  const { user } = useAuth();
  const theme = useAppTheme(user?.colorVisionType);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/social-onboarding" element={<SocialOnboardingPage />} />
          <Route path="/social-email-request" element={<SocialEmailRequestPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/mypage" element={
            user ? <Navigate to={`/profile/${user.nickname}`} replace /> : <Navigate to="/login" replace />
          } />
          <Route path="/profile/:userNickname" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App; 