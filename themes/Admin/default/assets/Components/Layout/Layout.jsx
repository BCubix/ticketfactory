import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Button, IconButton, Toolbar } from '@mui/material';
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
                display: 'flex',
                flex: 1,
                minWidth: 0,
                position: 'relative',
                height: '100%',
            }}
        >
            <Component.SideMenu
                sidebarWidth={contentMargin}
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
                    minHeight: '100%',
                    marginLeft: {
                        sm: `${contentMargin}px`,
                    },
                    transition: (theme) => theme.transitions.create(['margin-left']),
                }}
            >
                <AppBar
                    elevation={0}
                    position={'fixed'}
                    sx={{
                        height: (theme) => theme.layout.header.height,
                        width: { sm: `calc(100% - ${contentMargin}px)` },
                        ml: { sm: `${contentMargin}px` },
                        transition: (theme) => theme.transitions.create(['width']),
                    }}
                >
                    <Toolbar sx={{ height: '100%', px: { lg: 6, xs: 4 }, backgroundColor: (theme) => theme.palette.header.backgroundColor }}>
                        {!appContext?.sidebar.open && (
                            <IconButton
                                edge="start"
                                color="primary"
                                aria-label="open drawer"
                                sx={{
                                    ml: 0,
                                    mr: 3,
                                }}
                                onClick={() => {
                                    appContext.setSideBar({ ...appContext.sidebar, open: !Boolean(appContext?.sidebar?.open) });
                                }}
                            >
                                {appContext?.sidebar?.open ? <MenuOpenIcon /> : <MenuIcon />}
                            </IconButton>
                        )}
                        {user && (
                            <ProfileButton size="small" sx={{ marginLeft: 'auto' }} component={Link} to={`${Constant.USER_BASE_PATH}/${user?.id}${Constant.EDIT_PATH}`}>
                                <PersonIcon />
                            </ProfileButton>
                        )}

                        <Button onClick={handleLogout}>
                            <LogoutIcon sx={{ color: (theme) => theme.palette.secondary.main }} />
                        </Button>
                    </Toolbar>
                </AppBar>
                <Box
                    sx={{
                        display: 'flex',
                        minWidth: 0,
                        flex: 1,
                        flexDirection: 'column',
                        pb: 4,
                        pt: (theme) => `${theme.layout.header.height}px`,
                        px: { lg: 6, xs: 4 },
                        backgroundColor: (theme) => theme.palette.main.backgroundColor,
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};
