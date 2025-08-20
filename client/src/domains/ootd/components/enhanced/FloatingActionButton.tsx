import React, { useState } from 'react';
import { Fab, Tooltip, Box } from '@mui/material';
import { Add, Camera, Edit, Close } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';

interface FloatingActionButtonProps {
  onCreatePost: () => void;
  onTakePhoto?: () => void;
}

// 스타일드 컴포넌트들
const FloatingContainer = styled(Box)({
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '12px',
});

const MainFab = styled(motion.div)({
  position: 'relative',
});

const StyledMainFab = styled(Fab)(({ theme }) => ({
  width: '64px',
  height: '64px',
  background: 'linear-gradient(135deg, #007aff 0%, #0056d6 100%)',
  color: 'white',
  boxShadow: '0 8px 32px rgba(0, 122, 255, 0.4)',
  border: '2px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(20px)',
  '&:hover': {
    background: 'linear-gradient(135deg, #0056d6 0%, #003d99 100%)',
    boxShadow: '0 12px 40px rgba(0, 122, 255, 0.6)',
    transform: 'scale(1.05)',
  },
  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
}));

const SubFab = styled(motion.div)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const StyledSubFab = styled(Fab)(({ theme }) => ({
  width: '48px',
  height: '48px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  color: '#1d1d1f',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    transform: 'scale(1.1)',
  },
  transition: 'all 0.2s ease',
}));

const ActionLabel = styled(motion.div)({
  backgroundColor: 'rgba(29, 29, 31, 0.9)',
  backdropFilter: 'blur(20px)',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
});

// 애니메이션 variants
const containerVariants = {
  open: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  closed: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 300,
    },
  },
  closed: {
    opacity: 0,
    y: 20,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
};

const labelVariants = {
  open: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.1,
      duration: 0.2,
    },
  },
  closed: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.1,
    },
  },
};

const mainFabVariants = {
  open: {
    rotate: 45,
    scale: 1,
  },
  closed: {
    rotate: 0,
    scale: 1,
  },
  hover: {
    scale: 1.05,
  },
  tap: {
    scale: 0.95,
  },
};

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onCreatePost,
  onTakePhoto,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleCreatePost = () => {
    setIsOpen(false);
    onCreatePost();
  };

  const handleTakePhoto = () => {
    setIsOpen(false);
    if (onTakePhoto) {
      onTakePhoto();
    }
  };

  const actions = [
    {
      icon: <Edit sx={{ fontSize: 20 }} />,
      label: 'OOTD 작성하기',
      onClick: handleCreatePost,
      color: '#007aff',
    },
    ...(onTakePhoto ? [{
      icon: <Camera sx={{ fontSize: 20 }} />,
      label: '사진 촬영하기',
      onClick: handleTakePhoto,
      color: '#ff6b6b',
    }] : []),
  ];

  return (
    <FloatingContainer>
      <motion.div
        variants={containerVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
      >
        <AnimatePresence>
          {isOpen && (
            <>
              {actions.map((action, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  <SubFab>
                    <motion.div
                      variants={labelVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                    >
                      <ActionLabel>
                        {action.label}
                      </ActionLabel>
                    </motion.div>
                    
                    <Tooltip title={action.label} placement="left">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <StyledSubFab
                          onClick={action.onClick}
                          sx={{
                            '&:hover': {
                              color: action.color,
                            }
                          }}
                        >
                          {action.icon}
                        </StyledSubFab>
                      </motion.div>
                    </Tooltip>
                  </SubFab>
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 메인 FAB */}
      <MainFab>
        <Tooltip 
          title={isOpen ? '닫기' : 'OOTD 게시하기'} 
          placement="left"
        >
          <motion.div
            variants={mainFabVariants}
            animate={isOpen ? 'open' : 'closed'}
            whileHover="hover"
            whileTap="tap"
          >
            <StyledMainFab
              onClick={toggleMenu}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Close sx={{ fontSize: 28 }} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="add"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Add sx={{ fontSize: 28 }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </StyledMainFab>
          </motion.div>
        </Tooltip>

        {/* 펄스 애니메이션 링 */}
        <motion.div
          style={{
            position: 'absolute',
            top: '-4px',
            left: '-4px',
            right: '-4px',
            bottom: '-4px',
            borderRadius: '50%',
            border: '2px solid rgba(0, 122, 255, 0.3)',
            pointerEvents: 'none',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </MainFab>
    </FloatingContainer>
  );
};

export default FloatingActionButton; 