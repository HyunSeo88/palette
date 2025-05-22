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
  ListItemButtonProps
} from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface SlideInMenuProps {
  open: boolean;
  onClose: () => void;
}

const MenuLogoContainer = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2.5),
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  height: '4rem', // 64px, to match header height
  display: 'flex',
  alignItems: 'center',
}));

const StyledListItemButton = styled(ListItemButton)<ListItemButtonProps & { component?: React.ElementType, to?: string }>(({ theme }) => ({
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  color: theme.palette.text.primary,
  fontWeight: 500,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.primary.main,
  },
}));

const SubMenuListItemButton = styled(ListItemButton)<ListItemButtonProps & { component?: React.ElementType, to?: string }>(({ theme }) => ({
  paddingTop: theme.spacing(1.2),
  paddingBottom: theme.spacing(1.2),
  paddingLeft: theme.spacing(5),
  color: theme.palette.text.secondary,
  fontSize: '0.9rem',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    color: theme.palette.primary.main,
  },
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: 600,
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
  },
}));

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
      { text: '질문', link: '/board/qna' },
      { text: '투표', link: '/board/polls' },
      { text: 'OOTD', link: '/board/ootd' },
    ],
  },
  {
    text: '소통',
    submenu: [
      { text: '자유게시판', link: '/community/free' },
      { text: '자기소개', link: '/community/intro' },
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
      if (item.submenu) {
        return (
          <React.Fragment key={item.text + index}>
            <StyledListItemButton onClick={() => handleSubmenuToggle(item.text)}>
              <ListItemText primary={item.text} />
              {openSubmenus[item.text] ? <ExpandMoreIcon /> : <ChevronRightIcon />}
            </StyledListItemButton>
            <Collapse in={openSubmenus[item.text]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ backgroundColor: theme.palette.background.default }}>
                {item.submenu.map(subItem => (
                  // @ts-ignore
                  <SubMenuListItemButton
                    key={subItem.text}
                    component={RouterLink}
                    to={subItem.link}
                    onClick={onClose}
                  >
                    <ListItemText primary={subItem.text} />
                  </SubMenuListItemButton>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        );
      }
      return (
        // @ts-ignore
        <StyledListItemButton
          key={item.text + index}
          component={RouterLink}
          to={item.link || '#'}
          onClick={onClose}
        >
          <ListItemText primary={item.text} />
        </StyledListItemButton>
      );
    });
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 288,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[5],
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme.palette.grey[200],
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.primary.main,
            borderRadius: '3px',
          },
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme.palette.primary.main} ${theme.palette.grey[200]}`,
        },
      }}
    >
      <MenuLogoContainer>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Palette
        </Typography>
      </MenuLogoContainer>
      <List component="nav" sx={{ py: 1.5 }}>
        {renderMenu(menuItemsData)}
      </List>
    </Drawer>
  );
};

export default SlideInMenu; 