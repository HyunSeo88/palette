import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, Button, Avatar, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Menu as MenuIcon, 
  User as UserIcon, 
  Settings as SettingsIcon,
  Droplet as DropletIcon,
  LogIn as LogInIcon,
  X as CloseIcon
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
  Section,
  SectionTitle,
  SectionContent,
  ValueContent,
  HeaderIcons,
} from './MainLayout.styles';
import CommunityFeed from '../CommunityFeed/CommunityFeed';
import { getSectionColors } from '../../theme';

interface MenuItem {
  id: string;
  label: string;
  color: string;
  description?: string;
}

interface CommunityStats {
  label: string;
  value: string;
}

const MENU_ITEMS: MenuItem[] = [
  { 
    id: 'value', 
    label: 'Value', 
    color: '#4A90E2',
    description: '우리의 가치와 철학'
  },
  { 
    id: 'hot-posts', 
    label: 'Hot post', 
    color: '#E24A77',
    description: '인기 있는 게시물'
  },
  { 
    id: 'ootd', 
    label: "Today's best C", 
    color: '#4AE277',
    description: '오늘의 베스트 코디'
  },
  { 
    id: 'voting', 
    label: 'Voting', 
    color: '#E2C84A',
    description: '투표 진행중인 게시물'
  },
  { 
    id: 'events', 
    label: 'Discount & Event', 
    color: '#9B4AE2',
    description: '진행중인 이벤트'
  },
];

const COMMUNITY_STATS: CommunityStats[] = [
  { label: '회원', value: '1,234' },
  { label: '게시물', value: '56' },
  { label: '댓글', value: '789' },
];

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeMenu, setActiveMenu] = useState<string>('value');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const rightPanelRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute('data-section-id');
          if (sectionId) {
            setVisibleSections((prev) => {
              const newSet = new Set(prev);
              if (entry.isIntersecting) {
                newSet.add(sectionId);
                if (entry.intersectionRatio > 0.9) {
                  setActiveMenu(sectionId);
                }
              } else {
                newSet.delete(sectionId);
              }
              return newSet;
            });
          }
        });
      },
      {
        threshold: [0.1, 0.5, 0.9, 1.0],
        rootMargin: '-64px 0px -64px 0px',
      }
    );

    MENU_ITEMS.forEach((item) => {
      if (sectionRefs.current[item.id]) {
        observer.observe(sectionRefs.current[item.id]!);
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleMenuClick = (menuId: string): void => {
    setActiveMenu(menuId);
    setIsMobileMenuOpen(false);
    
    const element = sectionRefs.current[menuId];
    if (element && rightPanelRef.current) {
      rightPanelRef.current.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  const handleLoginOrProfile = (): void => {
    if (isAuthenticated) {
      navigate('/mypage');
    } else {
      navigate('/login');
    }
  };

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'value':
        return (
          <ValueContent>
            <img 
              src="https://source.unsplash.com/random/1200x800?minimal,fashion,abstract" 
              alt="가치관 대표 이미지"
            />
          </ValueContent>
        );
      case 'hot-posts':
      case 'ootd':
      case 'voting':
      case 'events':
        return <CommunityFeed sectionType={sectionId} />;
      default:
        return null;
    }
  };

  return (
    <LayoutContainer>
      <TopFixedArea>
        <Header>
          <Logo onClick={() => navigate('/')}>
            <DropletIcon />
            Palette
          </Logo>
          <HeaderIcons>
            <Tooltip title={isAuthenticated ? '마이페이지' : '로그인'}>
              <IconButton 
                onClick={handleLoginOrProfile}
                sx={{ 
                  mr: 1,
                  ...(isAuthenticated && {
                    padding: 0.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      border: '2px solid #fff'
                    }
                  })
                }}
              >
                {isAuthenticated ? (
                  <Avatar 
                    src={user?.photoURL}
                    alt={user?.nickname || 'profile'}
                  />
                ) : (
                  <LogInIcon size={24} />
                )}
              </IconButton>
            </Tooltip>
            <IconButton>
              <SettingsIcon size={24} />
            </IconButton>
            <IconButton onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
            </IconButton>
          </HeaderIcons>
        </Header>
      </TopFixedArea>

      <MainContent>
        <LeftPanel sx={{ 
          display: { xs: isMobileMenuOpen ? 'flex' : 'none', md: 'flex' },
          transition: 'transform 0.3s ease',
          transform: { 
            xs: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
            md: 'none'
          }
        }}>
          {MENU_ITEMS.map((item) => (
            <MenuItem
              key={item.id}
              active={activeMenu === item.id}
              onClick={() => handleMenuClick(item.id)}
              color={item.color}
            >
              <MenuDot color={item.color} />
              <Box>
                <Typography>{item.label}</Typography>
                {item.description && (
                  <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                    {item.description}
                  </Typography>
                )}
              </Box>
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

        <RightPanel ref={rightPanelRef}>
          {MENU_ITEMS.map((item) => (
            <Section
              key={item.id}
              ref={(el: HTMLDivElement | null) => (sectionRefs.current[item.id] = el)}
              data-section-id={item.id}
              bgcolor={item.color}
            >
              <SectionTitle className={visibleSections.has(item.id) ? 'visible' : ''}>
                {item.label}
              </SectionTitle>
              <SectionContent className={visibleSections.has(item.id) ? 'visible' : ''}>
                {renderSectionContent(item.id)}
              </SectionContent>
            </Section>
          ))}
        </RightPanel>
      </MainContent>
    </LayoutContainer>
  );
};

export default MainLayout; 