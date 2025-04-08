import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertOctagon } from 'react-feather';
import { useTheme } from '@mui/material/styles';
import {
    RightPanelHeader,
    RightPanelContent,
    RightPanelTitle,
    MenuIconButton,
    MenuContentContainer
} from '../MainLayout/MainLayout.styles';
import { MENU_ITEMS } from '../MainLayout/MainLayout.constants';
import MenuIcon from '@mui/icons-material/Menu';

const RightPanelLayout = ({ activeMenu, isLoading, error, handleRetry, ActiveContentComponent, isMobile }) => {
    const theme = useTheme();
    const activeMenuItem = MENU_ITEMS.find(item => item.id === activeMenu);

    const handleMobileMenuClick = () => {
        console.log("Mobile menu icon clicked");
    };

    return (
        <>
            <RightPanelHeader>
                <RightPanelTitle component="h2">
                    {activeMenuItem?.title || 'Palette'}
                </RightPanelTitle>
                <MenuIconButton aria-label="menu" onClick={handleMobileMenuClick}>
                    <MenuIcon />
                </MenuIconButton>
            </RightPanelHeader>
            <RightPanelContent>
                <AnimatePresence mode="wait">
                    {isLoading && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}
                        >
                            <CircularProgress />
                            <Typography sx={{ mt: 2 }}>로딩 중...</Typography>
                        </motion.div>
                    )}
                    {error && !isLoading && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}
                        >
                            <AlertOctagon size={48} color={theme.palette.error.main} />
                            <Typography color="error" variant="h6" sx={{ mt: 2, mb: 1 }}>{error}</Typography>
                            <Button onClick={handleRetry} variant="contained" sx={{ mt: 1 }}>다시 시도</Button>
                        </motion.div>
                    )}
                    {!isLoading && !error && ActiveContentComponent && (
                        <MenuContentContainer
                            key={activeMenu}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ActiveContentComponent />
                        </MenuContentContainer>
                    )}
                    {!isLoading && !error && !ActiveContentComponent && (
                        <motion.div
                            key="no-content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
                        >
                            <Typography>콘텐츠를 선택해주세요.</Typography>
                        </motion.div>
                    )}
                </AnimatePresence>
            </RightPanelContent>
        </>
    );
};

RightPanelLayout.propTypes = {
    activeMenu: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    handleRetry: PropTypes.func.isRequired,
    ActiveContentComponent: PropTypes.elementType, // The component to render
};

export default RightPanelLayout; 