import React from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, IconButton, Toolbar } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { logoutAction, profileSelector } from '@Redux/profile/profileSlice';
import { ProfileButton } from './sc.ProfileButton';
import { useSelector } from 'react-redux';
import useAppContext from '@/Config/useAppContext';
import { useMemo } from 'react';
import { useTheme } from '@emotion/react';

export const Layout = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(profileSelector);
    const appContext = useAppContext();
    const theme = useTheme();

    const handleLogout = async () => {
        dispatch(logoutAction());

        navigate(Constant.LOGIN_PATH);
    };

    const contentMargin = useMemo(() => {
        return appContext?.sidebar?.open ? theme.layout.sidebar.width : 0;
    }, [appContext?.sidebar?.open]);

    return (
        <Box
            sx={{
                flex: 1,
                minWidth: 0,
                position: 'relative',
                height: '100%',
            }}
        >
            <AppBar
                elevation={0}
                position={'fixed'}
                sx={{
                    height: (theme) => theme.layout.header.height,
                    width: { sm: `100%` },
                    transition: (theme) => theme.transitions.create(['width']),
                }}
            >
                <Toolbar sx={{ height: '100%', px: { lg: 6, xs: 4 }, backgroundColor: (theme) => theme.palette.secondary.light, boxShadow: '5px 0 10px rgba(0, 0, 0, 0.085)' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            paddingInline: 2,
                            paddingBlock: 4,
                            height: theme.layout.header.height,
                        }}
                    >
                        <Box component={RouterLink} to={Constant.HOME_PATH} height="100%" maxWidth={150}>
                            <Box component="img" src={Constant.LOGOS_FILE_PATH + Constant.DEFAULT_LOGOS_FILE} height="100%" width="100%" />
                        </Box>
                        <IconButton
                            edge="start"
                            color="primary"
                            aria-label="open drawer"
                            sx={{
                                ml: 8,
                                mr: 3,
                            }}
                            onClick={() => {
                                appContext.setSideBar({ ...appContext.sidebar, open: !Boolean(appContext?.sidebar?.open) });
                            }}
                        >
                            {appContext?.sidebar?.open ? <MenuOpenIcon /> : <MenuIcon />}
                        </IconButton>
                    </Box>

                    {user && (
                        <ProfileButton size="small" sx={{ marginLeft: 'auto' }} component={RouterLink} to={`${Constant.USER_BASE_PATH}/${user?.id}${Constant.EDIT_PATH}`}>
                            <PersonIcon />
                        </ProfileButton>
                    )}

                    <ProfileButton size="small" sx={{ marginLeft: 3 }} onClick={handleLogout}>
                        <LogoutIcon color="primary" />
                    </ProfileButton>
                </Toolbar>
            </AppBar>

            <Box
                sx={{
                    display: 'flex',
                    minWidth: 0,
                    flex: 1,
                    minHeight: '100%',
                    marginLeft: {
                        sm: `${contentMargin}px`,
                    },
                    transition: (theme) => theme.transitions.create(['margin-left']),
                }}
            >
                <Component.SideMenu
                    sidebarWidth={contentMargin}
                    headerHeight={theme.layout.header.height}
                    closeSidebar={() => {
                        appContext.setSideBar({ ...appContext.sidebar, open: false });
                    }}
                    sidebarOpen={appContext?.sidebar?.open}
                />
                <Box
                    sx={{
                        display: 'flex',
                        minWidth: 0,
                        flex: 1,
                        flexDirection: 'column',
                        pb: 4,
                        pt: (theme) => `${theme.layout.header.height}px`,
                        backgroundColor: (theme) => theme.palette.main.backgroundColor,
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};
