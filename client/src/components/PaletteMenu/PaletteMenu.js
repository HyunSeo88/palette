import React from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { menuIcons, MENU_ITEMS as CONSTANTS_MENU_ITEMS } from './PaletteMenu.constants';

// 메뉴 아이템 정의 (PaletteMenu.constants.js의 값과 병합)
export const MENU_ITEMS = CONSTANTS_MENU_ITEMS.map(item => ({
  ...item,
  id: item.id,
  label: item.title || item.label,
  icon: item.icon || '🔹' // 기본 아이콘 제공
}));

// 스타일 컴포넌트
const MenuContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(2),
  width: '100%',
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1),
    flexWrap: 'nowrap',
    overflowX: 'auto',
    padding: theme.spacing(1, 0),
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
  },
}));

const MenuItem = styled(motion.div)(({ theme, color, isActive }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  cursor: 'pointer',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  minWidth: '80px',
  backgroundColor: isActive ? color : 'transparent',
  transition: 'all 0.3s ease',
  
  [theme.breakpoints.down('sm')]: {
    minWidth: '60px',
    padding: theme.spacing(0.5),
  },

  '&:hover': {
    backgroundColor: color,
    transform: 'translateY(-2px)',
  },
}));

const IconWrapper = styled(Box)(({ theme, color, isActive }) => ({
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: isActive ? theme.palette.common.white : color,
  fontSize: '24px',
  transition: 'all 0.3s ease',
  
  [theme.breakpoints.down('sm')]: {
    width: '40px',
    height: '40px',
    fontSize: '20px',
  },
}));

const MenuLabel = styled(Typography)(({ theme, isActive }) => ({
  fontSize: '0.875rem',
  fontWeight: isActive ? 600 : 400,
  color: isActive ? theme.palette.common.white : theme.palette.text.primary,
  textAlign: 'center',
  whiteSpace: 'nowrap',
  
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.75rem',
  },
}));

/**
 * 팔레트 메뉴 컴포넌트
 */
const PaletteMenu = ({ items = MENU_ITEMS, activeItem, onMenuClick, isMobile }) => {
  const theme = useTheme();

  return (
    <MenuContainer>
      <AnimatePresence>
        {items.map((item) => {
          const IconComponent = menuIcons[item.id];
          
          return (
            <MenuItem
              key={item.id}
              color={item.color}
              isActive={activeItem === item.id}
              onClick={() => onMenuClick(item.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <IconWrapper color={item.color} isActive={activeItem === item.id}>
                {IconComponent ? <IconComponent size={24} /> : item.icon}
              </IconWrapper>
              <MenuLabel 
                variant="body2" 
                isActive={activeItem === item.id}
                sx={{ 
                  display: { xs: isMobile ? 'none' : 'block', sm: 'block' } 
                }}
              >
                {item.label}
              </MenuLabel>
            </MenuItem>
          );
        })}
      </AnimatePresence>
    </MenuContainer>
  );
};

PaletteMenu.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
    })
  ),
  activeItem: PropTypes.string.isRequired,
  onMenuClick: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
};

export default PaletteMenu; 