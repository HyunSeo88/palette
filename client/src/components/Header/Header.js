import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  InputBase,
  IconButton,
  Avatar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home'; // Example icon
import { LogoContainer, Search, SearchIconWrapper, StyledInputBase, IconsContainer } from './Header.styles';

const Header = () => {
  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <LogoContainer>
          {/* Placeholder for Logo - replace with actual logo component/SVG */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
             <circle cx="16" cy="16" r="15" fill="#FF6B6B"/>
             <circle cx="16" cy="16" r="10" fill="white"/>
             <circle cx="16" cy="16" r="5" fill="#4ECDC4"/>
          </svg>
          {/* Optional: Add Brand Name Text */}
          {/* <Typography variant="h6" noWrap component="div" sx={{ ml: 1, fontWeight: 'bold' }}>
            Palette
          </Typography> */}
        </LogoContainer>

        {/* Search Bar */}
        <Search>
          <SearchIconWrapper>
            <SearchIcon sx={{ color: 'grey.500' }} />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="검색…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>

        {/* Icons and Profile */}
        <IconsContainer>
          <IconButton aria-label="home" sx={{ color: 'black' }}>
            <HomeIcon />
          </IconButton>
          <IconButton aria-label="create" sx={{ color: 'black' }}>
            <AddIcon />
          </IconButton>
          <IconButton aria-label="notifications" sx={{ color: 'black' }}>
            <NotificationsIcon />
          </IconButton>
          <IconButton aria-label="messages" sx={{ color: 'black' }}>
            <MessageIcon />
          </IconButton>
          <IconButton aria-label="profile">
            {/* Replace with actual user avatar */}
            <Avatar sx={{ width: 28, height: 28 }} alt="User Name" src="https://i.pravatar.cc/30?u=a042581f4e29026704d" />
          </IconButton>
        </IconsContainer>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 