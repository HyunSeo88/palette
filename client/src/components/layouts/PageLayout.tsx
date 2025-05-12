import React from 'react';
import { Box, Container, ContainerProps } from '@mui/material';
import BackButton from '../common/BackButton';

interface PageLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  maxWidth?: ContainerProps['maxWidth'];
  containerSx?: Record<string, any>;
  backButtonProps?: {
    position?: 'fixed' | 'absolute' | 'static';
    top?: number | string;
    left?: number | string;
    zIndex?: number;
    onClick?: () => void;
  };
}

/**
 * 페이지 레이아웃 컴포넌트
 * 
 * 페이지의 공통 레이아웃을 제공하며 뒤로가기 버튼을 포함합니다.
 */
const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  showBackButton = true,
  maxWidth = 'lg',
  containerSx = {},
  backButtonProps = {}
}) => {
  return (
    <Box position="relative">
      {showBackButton && (
        <BackButton
          {...backButtonProps}
        />
      )}
      <Container
        maxWidth={maxWidth}
        sx={{
          pt: 4,
          pb: 4,
          ...containerSx
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default PageLayout; 