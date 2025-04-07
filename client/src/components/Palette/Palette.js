import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const PaletteContainer = styled.div`
  position: absolute;
  top: 50px;
  left: 60px;
  width: 65px;
  height: 65px;
  z-index: 10;
  filter: drop-shadow(0 5px 10px rgba(0,0,0,0.2));
`;

const PaletteSVG = styled.svg`
  width: 100%;
  height: 100%;
  transform-origin: center;
  transition: transform 0.8s cubic-bezier(0.68, -0.6, 0.32, 1.6);
`;

const PaletteSegment = styled(motion.path)`
  cursor: pointer;
  transition: opacity 0.3s ease, transform 0.3s ease;
  transform-origin: center;

  &:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }
`;

const Palette = ({ currentAngle, onSegmentClick }) => {
  const segments = [
    { color: '#87CEEB', menu: 'values', d: 'M 50,50 L 50,2 A 48,48 0 0 1 88.63,29.4 L 50,50 Z' },
    { color: '#FF6347', menu: 'hot', d: 'M 50,50 L 88.63,29.4 A 48,48 0 0 1 73.63,82.6 L 50,50 Z' },
    { color: '#FFDA63', menu: 'best-outfit', d: 'M 50,50 L 73.63,82.6 A 48,48 0 0 1 26.37,82.6 L 50,50 Z' },
    { color: '#B0B0B0', menu: 'poll', d: 'M 50,50 L 26.37,82.6 A 48,48 0 0 1 11.37,29.4 L 50,50 Z' },
    { color: '#F5F5F5', menu: 'event', d: 'M 50,50 L 11.37,29.4 A 48,48 0 0 1 50,2 L 50,50 Z' }
  ];

  return (
    <PaletteContainer>
      <PaletteSVG
        viewBox="0 0 100 100"
        style={{ transform: `rotate(${currentAngle}deg)` }}
      >
        <defs>
          <filter id="dropShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="1" dy="2" result="offsetblur"/>
            <feFlood floodColor="rgba(0,0,0,0.3)"/>
            <feComposite in2="offsetblur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
3        </defs>
        <circle cx="50" cy="50" r="48" fill="#FDFDFD" filter="url(#dropShadow)" />
        {segments.map((segment, index) => (
          <PaletteSegment
            key={index}
            d={segment.d}
            fill={segment.color}
            data-menu={segment.menu}
            onClick={() => onSegmentClick(segment.menu)}
            whileHover={{ scale: 1.05, opacity: 0.8 }}
            transition={{ duration: 0.3 }}
          />
        ))}
        <circle cx="50" cy="50" r="20" fill="#E0E0E0" style={{ pointerEvents: 'none' }}/>
        <circle cx="50" cy="50" r="15" fill="#F8F8F8" style={{ pointerEvents: 'none' }}/>
        <circle cx="50" cy="50" r="10" fill="#CDCDCD" style={{ pointerEvents: 'none' }}/>
        <circle cx="50" cy="50" r="5" fill="#BDBDBD" style={{ pointerEvents: 'none' }}/>
        <circle cx="50" cy="50" r="48" fill="none" stroke="#FFF" strokeWidth="1" opacity="0.5" style={{ pointerEvents: 'none' }}/>
      </PaletteSVG>
    </PaletteContainer>
  );
};

export default Palette; 