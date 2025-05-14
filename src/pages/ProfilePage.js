import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, Tabs, Tab, Paper, Avatar, Grid } from '@mui/material';

// Placeholder for a more sophisticated TabPanel
function TabPanel(props) {
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

function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

const ProfilePage = () => {
  const { userNickname } = useParams();
  const [currentTab, setCurrentTab] = React.useState(0);

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Placeholder user data - in a real app, this would be fetched
  const userProfile = {
    displayName: userNickname || "User",
    avatarUrl: "", // Placeholder,
    bio: "This is a short bio of the user. They love fashion and sharing their style on Palette!",
    stats: {
      posts: 123,
      followers: 456,
      following: 789,
    },
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 900, margin: '2rem auto', p: 3 }}>
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
              <Typography variant="caption" color="text.secondary">Posts</Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6">{userProfile.stats.followers}</Typography>
              <Typography variant="caption" color="text.secondary">Followers</Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6">{userProfile.stats.following}</Typography>
              <Typography variant="caption" color="text.secondary">Following</Typography>
            </Box>
          </Box>
          {/* Add Follow/Edit Profile button here if applicable */}
          {/* For now, a placeholder button */}
          <Button variant="contained" sx={{ mb: 2 }}>Follow</Button>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentTab} onChange={handleChangeTab} aria-label="profile content tabs">
              <Tab label="My Posts" {...a11yProps(0)} />
              <Tab label="Liked Posts" {...a11yProps(1)} />
              <Tab label="My Votes" {...a11yProps(2)} />
              <Tab label="Settings" {...a11yProps(3)} />
            </Tabs>
          </Box>
          <TabPanel value={currentTab} index={0}>
            Content for My Posts (e.g., a list of posts written by {userNickname})
            {/* Placeholder for actual post list component */}
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            Content for Liked Posts (e.g., a list of posts liked by {userNickname})
          </TabPanel>
          <TabPanel value={currentTab} index={2}>
            Content for My Votes (e.g., a list of polls {userNickname} participated in)
          </TabPanel>
          <TabPanel value={currentTab} index={3}>
            User account settings and preferences will go here.
          </TabPanel>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProfilePage; 