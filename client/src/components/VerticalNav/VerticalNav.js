import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { VerticalNavContainer, VerticalNavItem } from '../MainLayout/MainLayout.styles'; // Import styles from MainLayout for now
import { menuIcons, MENU_ITEMS } from '../MainLayout/MainLayout.constants'; // Corrected import path

const VerticalNav = ({ activeItem, onSelectItem }) => {
  return (
    <VerticalNavContainer>
      {MENU_ITEMS.map((item) => {
        const IconComponent = menuIcons[item.id];
        const isActive = activeItem === item.id;

        return (
          <VerticalNavItem
            key={item.id}
            isActive={isActive}
            itemColor={item.color} // Pass color for active state styling
            onClick={() => onSelectItem(item.id)}
            startIcon={IconComponent ? <IconComponent size={24} /> : null}
          >
            <Typography variant="body1" sx={{ fontWeight: isActive ? '600' : '400' }}>
              {item.title}
            </Typography>
          </VerticalNavItem>
        );
      })}
    </VerticalNavContainer>
  );
};

VerticalNav.propTypes = {
  activeItem: PropTypes.string.isRequired,
  onSelectItem: PropTypes.func.isRequired,
};

export default VerticalNav; 