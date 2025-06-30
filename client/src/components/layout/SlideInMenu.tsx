import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Drawer,
  Divider,
  ListItemButtonProps,
  IconButton
} from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';

interface SlideInMenuProps {
  open: boolean;
  onClose: () => void;
}

// Apple 스타일 컴포넌트들
const AppleDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 320,
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(30px)',
    borderRight: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '6px',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      }
    },
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(0, 0, 0, 0.2) transparent',
  },
}));

const MenuHeader = styled(Box)({
  padding: '24px 20px 16px 20px',
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  background: 'rgba(255, 255, 255, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'sticky',
  top: 0,
  zIndex: 10,
  backdropFilter: 'blur(20px)',
});

const AppleLogo = styled(Typography)({
  fontSize: '1.75rem',
  fontWeight: 700,
  color: '#1d1d1f',
  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  letterSpacing: '-0.02em',
  background: 'linear-gradient(135deg, #007aff 0%, #5856d6 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
});

const CloseButton = styled(IconButton)({
  width: '32px',
  height: '32px',
  backgroundColor: 'rgba(0, 0, 0, 0.08)',
  borderRadius: '50%',
  transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    transform: 'scale(1.05)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '18px',
    color: '#1d1d1f',
  }
});

const MenuContainer = styled(Box)({
  padding: '16px 12px',
});

const AppleListItemButton = styled(ListItemButton)<ListItemButtonProps & { component?: React.ElementType, to?: string }>(({ theme }) => ({
  padding: '14px 16px',
  margin: '4px 0',
  borderRadius: '12px',
  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  fontWeight: 500,
  fontSize: '1rem',
  color: '#1d1d1f',
  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  background: 'transparent',
  minHeight: 'unset',
  '&:hover': {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    color: '#007aff',
    transform: 'translateX(4px)',
  },
  '&:active': {
    transform: 'translateX(4px) scale(0.98)',
  },
  '& .MuiListItemText-primary': {
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: 500,
    fontSize: '1rem',
  },
  '& .MuiSvgIcon-root': {
    color: 'inherit',
    transition: 'transform 0.2s ease',
  }
}));

const AppleSubMenuButton = styled(ListItemButton)<ListItemButtonProps & { component?: React.ElementType, to?: string }>(({ theme }) => ({
  padding: '10px 16px 10px 32px',
  margin: '2px 0',
  borderRadius: '8px',
  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  fontWeight: 400,
  fontSize: '0.9rem',
  color: '#86868b',
  transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  background: 'transparent',
  minHeight: 'unset',
  '&:hover': {
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
    color: '#007aff',
    transform: 'translateX(8px)',
  },
  '&:active': {
    transform: 'translateX(8px) scale(0.98)',
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    color: '#007aff',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: 'rgba(0, 122, 255, 0.2)',
    }
  },
  '& .MuiListItemText-primary': {
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: '0.9rem',
  }
}));

const MenuSection = styled(Box)({
  marginBottom: '24px',
});

const SectionDivider = styled(Divider)({
  margin: '16px 0',
  backgroundColor: 'rgba(0, 0, 0, 0.08)',
  height: '1px',
});

interface MenuItemStructure {
  text: string;
  link?: string;
  submenu?: SubMenuItemStructure[];
}

interface SubMenuItemStructure {
  text: string;
  link: string;
  activeMatch?: string;
}

const menuItemsData: MenuItemStructure[] = [
  { text: 'About Us', link: '/about' },
  {
    text: '게시판',
    submenu: [
      { text: '질문', link: '/qna' },
      { text: '투표', link: '/polls' },
      { text: 'OOTD', link: '/ootd' },
    ],
  },
  {
    text: '소통',
    submenu: [
      { text: '자유게시판', link: '/free' },
      { text: '자기소개', link: '/introduction' },
    ],
  },
  {
    text: '이벤트/할인',
    submenu: [
      { text: '이벤트', link: '/events' },
      { text: '할인', link: '/discounts' },
    ],
  },
  { text: '출석체크', link: '/attendance' },
];

const SlideInMenu: React.FC<SlideInMenuProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const handleSubmenuToggle = (text: string) => {
    setOpenSubmenus(prev => ({ ...prev, [text]: !prev[text] }));
  };

  const renderMenu = (items: MenuItemStructure[]) => {
    return items.map((item, index) => {
      const isLastItem = index === items.length - 1;
      
      if (item.submenu) {
        const isOpen = openSubmenus[item.text];
        return (
          <MenuSection key={item.text + index}>
            <AppleListItemButton onClick={() => handleSubmenuToggle(item.text)}>
              <ListItemText primary={item.text} />
              {isOpen ? (
                <ExpandMoreIcon sx={{ 
                  transform: 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }} />
              ) : (
                <ChevronRightIcon sx={{ 
                  transform: 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }} />
              )}
            </AppleListItemButton>
            <Collapse 
              in={isOpen} 
              timeout={{
                enter: 300,
                exit: 200
              }}
              easing={{
                enter: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                exit: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            >
              <List component="div" disablePadding sx={{ pl: 1, mt: 1 }}>
                {item.submenu.map(subItem => (
                  // @ts-ignore
                  <AppleSubMenuButton
                    key={subItem.text}
                    component={RouterLink}
                    to={subItem.link}
                    onClick={onClose}
                  >
                    <ListItemText primary={subItem.text} />
                  </AppleSubMenuButton>
                ))}
              </List>
            </Collapse>
            {!isLastItem && <SectionDivider />}
          </MenuSection>
        );
      }
      return (
        <MenuSection key={item.text + index}>
          {/* @ts-ignore */}
          <AppleListItemButton
            component={RouterLink}
            to={item.link || '#'}
            onClick={onClose}
          >
            <ListItemText primary={item.text} />
          </AppleListItemButton>
          {!isLastItem && <SectionDivider />}
        </MenuSection>
      );
    });
  };

  return (
    <AppleDrawer
      anchor="left"
      open={open}
      onClose={onClose}
      SlideProps={{
        direction: 'right'
      }}
      transitionDuration={{
        enter: 300,
        exit: 250
      }}
    >
      <MenuHeader>
        <AppleLogo>
          Palette
        </AppleLogo>
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
      </MenuHeader>
      
      <MenuContainer>
        <List component="nav" disablePadding>
          {renderMenu(menuItemsData)}
        </List>
      </MenuContainer>
    </AppleDrawer>
  );
};

export default SlideInMenu; 