import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Tabs, Tab, Paper, Avatar, Grid, IconButton } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import SettingsIcon from '@mui/icons-material/Settings';
import BackButton from '../components/common/BackButton';

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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

interface UserProfile {
  displayName: string;
  avatarUrl?: string;
  bio: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
}

const ProfilePage: React.FC = () => {
  const { userNickname } = useParams<{ userNickname: string }>();
  const [currentTab, setCurrentTab] = useState<number>(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Check if viewing own profile
  const isOwnProfile = user?.nickname === userNickname;

  // Placeholder user data - in a real app, this would be fetched from an API
  const userProfile: UserProfile = {
    displayName: userNickname || "User",
    avatarUrl: "", // This would be fetched from the API
    bio: "This is a short bio of the user. They love fashion and sharing their style on Palette!",
    stats: {
      posts: 123,
      followers: 456,
      following: 789,
    },
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 900, margin: '2rem auto', p: 3, position: 'relative' }}>
      <BackButton 
        position="absolute" 
        top={16}
        left={16}
      />
      
      {isOwnProfile && (
        <IconButton 
          onClick={() => navigate('/settings')} 
          sx={{ position: 'absolute', top: 16, right: 16 }}
        >
          <SettingsIcon />
        </IconButton>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar
            alt={userProfile.displayName}
            src={userProfile.avatarUrl || `https://via.placeholder.com/150/92c952/FFFFFF?text=${userProfile.displayName.charAt(0)}`}
            sx={{ width: 150, height: 150, mb: 2, fontSize: '4rem' }}
          />
          <Typography variant="h5" component="h1" gutterBottom>
            {userProfile.displayName}
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
            {userProfile.bio}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%', mb: 2 }}>
            <Box textAlign="center">
              <Typography variant="h6">{userProfile.stats.posts}</Typography>
              <Typography variant="caption" color="text.secondary">게시물</Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6">{userProfile.stats.followers}</Typography>
              <Typography variant="caption" color="text.secondary">팔로워</Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6">{userProfile.stats.following}</Typography>
              <Typography variant="caption" color="text.secondary">팔로잉</Typography>
            </Box>
          </Box>
          {isOwnProfile ? (
            <Button variant="outlined" onClick={() => navigate('/settings')} sx={{ mb: 2 }}>프로필 편집</Button>
          ) : (
            <Button variant="contained" sx={{ mb: 2 }}>팔로우</Button>
          )}
        </Grid>
        <Grid item xs={12} md={8}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentTab} onChange={handleChangeTab} aria-label="profile content tabs">
              <Tab label="게시물" {...a11yProps(0)} />
              <Tab label="좋아요한 게시물" {...a11yProps(1)} />
              <Tab label="참여한 투표" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <TabPanel value={currentTab} index={0}>
            {userNickname}님이 작성한 게시물 목록이 표시됩니다.
            {/* Placeholder for actual post list component */}
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            {userNickname}님이 좋아요한 게시물 목록이 표시됩니다.
          </TabPanel>
          <TabPanel value={currentTab} index={2}>
            {userNickname}님이 참여한 투표 목록이 표시됩니다.
          </TabPanel>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProfilePage; 