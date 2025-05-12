import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Tooltip, useTheme, SxProps, Theme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface BackButtonProps {
  tooltip?: string;
  onClick?: () => void;
  position?: 'fixed' | 'absolute' | 'static';
  top?: number | string;
  left?: number | string;
  zIndex?: number;
  sx?: SxProps<Theme>;
}

/**
 * 페이지에서 뒤로가기 기능을 제공하는 버튼 컴포넌트
 */
const BackButton: React.FC<BackButtonProps> = ({
  tooltip = '뒤로 가기',
  onClick,
  position = 'absolute',
  top = 16,
  left = 16,
  zIndex = 10,
  sx = {},
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <Tooltip title={tooltip}>
      <IconButton
        onClick={handleClick}
        sx={{
          position,
          top,
          left,
          zIndex,
          bgcolor: theme.palette.background.paper,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
          '&:hover': {
            bgcolor: theme.palette.background.default,
          },
          transition: 'all 0.2s ease',
          ...sx,
        }}
        aria-label="뒤로 가기"
      >
        <ArrowBackIcon />
      </IconButton>
    </Tooltip>
  );
};

export default BackButton; 