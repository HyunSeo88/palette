import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { 
  Menu as MenuIcon, 
  User as UserIcon, 
  Settings as SettingsIcon, 
  Feather 
} from 'react-feather';
import {
  LayoutContainer,
  TopFixedArea,
  Header,
  Logo,
  MainContent,
  LeftPanel,
  MenuItem,
  MenuIcon as MenuDot,
  CommunityStats,
  RightPanel,
  ValueContent,
  HeaderIcons,
} from './MainLayout.styles';
import CommunityFeed from '../CommunityFeed/CommunityFeed';
import { SECTION_COLORS } from '../../theme';

const MENU_ITEMS = [
  { id: 'value', label: 'Value', color: '#4A90E2' },
  { id: 'hot-posts', label: 'Hot post', color: '#E24A77' },
  { id: 'ootd', label: "Today's best C", color: '#4AE277' },
  { id: 'voting', label: 'Voting', color: '#E2C84A' },
  { id: 'events', label: 'Discount & Event', color: '#9B4AE2' },
];

const COMMUNITY_STATS = [
  { label: '회원', value: '1,234' },
  { label: '게시물', value: '56' },
  { label: '댓글', value: '789' },
];

const MainLayout = () => {
  const [activeMenu, setActiveMenu] = useState('value');
  const [showValueContent, setShowValueContent] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState(SECTION_COLORS.value);
  
  // Get active menu color
  const activeMenuColor = MENU_ITEMS.find(item => item.id === activeMenu)?.color || MENU_ITEMS[0].color;

  useEffect(() => {
    document.documentElement.style.setProperty('--background-color', backgroundColor);
  }, [backgroundColor]);

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
    setShowValueContent(menuId === 'value');
    setBackgroundColor(SECTION_COLORS[menuId] || SECTION_COLORS.value);
  };

  return (
    <LayoutContainer>
      <TopFixedArea>
        <Header>
          <Logo>
            <Feather />
            Palette
          </Logo>
          <HeaderIcons>
            <IconButton>
              <UserIcon size={24} />
            </IconButton>
            <IconButton>
              <SettingsIcon size={24} />
            </IconButton>
            <IconButton>
              <MenuIcon size={24} />
            </IconButton>
          </HeaderIcons>
        </Header>
        
        <MainContent>
          <LeftPanel>
            {MENU_ITEMS.map((item) => (
              <MenuItem
                key={item.id}
                active={activeMenu === item.id}
                onClick={() => handleMenuClick(item.id)}
              >
                <MenuDot color={item.color} />
                <Typography>{item.label}</Typography>
              </MenuItem>
            ))}
            
            <CommunityStats>
              <Typography variant="subtitle2">커뮤니티 현황</Typography>
              {COMMUNITY_STATS.map((stat, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {stat.value}
                  </Typography>
                </Box>
              ))}
            </CommunityStats>
          </LeftPanel>

          <RightPanel bgcolor={activeMenuColor}>
            {showValueContent && (
              <ValueContent>
                <img 
                  src="https://source.unsplash.com/random/1200x800?minimal,fashion,abstract" 
                  alt="가치관 대표 이미지"
                />
              </ValueContent>
            )}
          </RightPanel>
        </MainContent>
      </TopFixedArea>

      <CommunityFeed />
    </LayoutContainer>
  );
};

export default MainLayout;