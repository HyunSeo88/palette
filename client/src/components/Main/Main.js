import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Palette from '../Palette/Palette';
import Blob from '../Blob/Blob';
import Values from './Content/Values';

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: var(--white);
  display: flex;
  overflow: hidden;
  position: relative;
`;

const LeftPanel = styled.div`
  width: 35%;
  height: 100%;
  position: relative;
`;

const PanelBackground = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transition: background-color 0.8s ease-in-out;
  background-color: ${props => props.bgColor || 'var(--sky-blue)'};
  z-index: 0;
  background-image: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.05) 100%);
`;

const RightPanel = styled.div`
  width: 65%;
  padding: 50px 60px;
  position: relative;
  background-color: var(--white);
  display: flex;
  flex-direction: column;
`;

const ContentContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px 10px 20px 20px;
  position: relative;
  margin-bottom: 80px;
`;

const Content = styled(motion.div)`
  position: absolute;
  top: 20px;
  left: 20px;
  right: 30px;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  padding-bottom: 20px;

  &.active {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }
`;

const Main = () => {
  const [currentMenu, setCurrentMenu] = useState('values');
  const [currentAngle, setCurrentAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  const menuAngles = {
    values: 0,
    hot: -72,
    'best-outfit': -144,
    poll: -216,
    event: -288
  };

  const menuColors = {
    values: '#87CEEB',
    hot: '#FF6347',
    'best-outfit': '#FFDA63',
    poll: '#B0B0B0',
    event: '#F5F5F5'
  };

  useEffect(() => {
    let interval;
    if (autoRotate) {
      interval = setInterval(() => {
        const currentIndex = Object.keys(menuAngles).indexOf(currentMenu);
        const nextIndex = (currentIndex + 1) % Object.keys(menuAngles).length;
        const nextMenu = Object.keys(menuAngles)[nextIndex];
        handleMenuChange(nextMenu);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [currentMenu, autoRotate]);

  const handleMenuChange = (menu) => {
    setCurrentMenu(menu);
    setCurrentAngle(menuAngles[menu]);
  };

  const handlePaletteHover = (isHovering) => {
    setAutoRotate(!isHovering);
  };

  return (
    <MainContainer>
      <LeftPanel>
        <PanelBackground bgColor={menuColors[currentMenu]} />
        <Blob
          size="25vw"
          position={{ top: '55%', left: '-5%' }}
        />
        <Blob
          size="15vw"
          position={{ top: '15%', left: '60%' }}
          delay={1}
        />
        <Palette
          currentAngle={currentAngle}
          onSegmentClick={handleMenuChange}
        />
      </LeftPanel>
      <RightPanel>
        <ContentContainer>
          <AnimatePresence>
            <Content
              key={currentMenu}
              className={currentMenu === 'values' ? 'active' : ''}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              {currentMenu === 'values' && <Values />}
              {/* 다른 메뉴 컨텐츠들 */}
            </Content>
          </AnimatePresence>
        </ContentContainer>
      </RightPanel>
    </MainContainer>
  );
};

export default Main; 