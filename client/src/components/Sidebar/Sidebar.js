import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { SidebarContainer, SidebarItem } from '../MainLayout/MainLayout.styles'; // Use updated styles
import { menuIcons, MENU_ITEMS } from '../MainLayout/MainLayout.constants'; // Use constants

const Sidebar = ({ activeItem, onSelectItem }) => {
  return (
    <SidebarContainer>
      {MENU_ITEMS.map((item) => {
        const IconComponent = menuIcons[item.id];
        const isSelected = activeItem === item.id;

        return (
          <SidebarItem
            key={item.id}
            selected={isSelected} // Use 'selected' prop based on styles
            itemcolor={item.color} // Use 'itemcolor' prop based on styles
            onClick={() => onSelectItem(item.id)}
            startIcon={IconComponent ? <IconComponent size={20} /> : null} // Adjusted icon size
          >
            {/* Text is part of the Button in SidebarItem style */}
            {item.title}
          </SidebarItem>
        );
      })}
    </SidebarContainer>
  );
};

Sidebar.propTypes = {
  activeItem: PropTypes.string.isRequired,
  onSelectItem: PropTypes.func.isRequired,
};

export default Sidebar; 