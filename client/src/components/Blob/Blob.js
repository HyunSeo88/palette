import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const BlobContainer = styled(motion.div)`
  position: absolute;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02));
  border-radius: 50%;
  z-index: 1;
  filter: blur(15px);
  pointer-events: none;
`;

const Blob = ({ size, position, delay }) => {
  const variants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 3, 0],
      transition: {
        duration: 8 + Math.random() * 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay || 0
      }
    }
  };

  return (
    <BlobContainer
      style={{
        width: size,
        height: size,
        top: position.top,
        left: position.left
      }}
      variants={variants}
      animate="animate"
    />
  );
};

export default Blob; 