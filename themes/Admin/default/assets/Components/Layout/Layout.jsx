import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import EngineeringIcon from '@mui/icons-material/Engineering';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import PersonIcon from '@mui/icons-material/Person';
import PestControlIcon from '@mui/icons-material/PestControl';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { logoutAction, userProfileSelector } from '@Apps/Auth/redux/userProfile/userProfileSlice';
import { parametersSelector } from '@Apps/Parameters/redux/parameters/parametersSlice';
import { ProfileButton } from './sc.ProfileButton';

import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import useAppContext from '@/Config/useAppContext';

export const Layout = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(userProfileSelector);
    const { parameters } = useSelector(parametersSelector);
    const appContext = useAppContext();
    const theme = useTheme();

    const handleLogout = async () => {
        dispatch(logoutAction());

        navigate(Constant.LOGIN_PATH);
    };

    const debugParameter = useMemo(() => {
        return parameters?.find((item) => item.paramKey === 'core_debug_mode')?.paramValue || false;
    }, [parameters]);

    const maintenanceParameter = useMemo(() => {
        return parameters?.find((item) => item.paramKey === 'core_maintenance_mode')?.paramValue || false;
    }, [parameters]);

    const contentMargin = useMemo(() => {
        return appContext?.sidebar?.open ? theme.layout.sidebar.width : 0;
    }, [appContext?.sidebar?.open]);

    return (
        <Box className="layout">
            <AppBar
                className="layout-header"
                elevation={0}
                sx={{
                    height: (theme) => theme.layout.header.height,
                    transition: (theme) => theme.transitions.create(['width']),
                }}
            >
                <Toolbar
                    className="toolbar"
                    sx={{
                        px: { lg: 6, sm: 4, xs: 2 },
                        backgroundColor: (theme) => theme.palette.secondary.light,
                    }}
                >
                    <Box
                        className="toolbar-left"
                        sx={{
                            height: theme.layout.header.height,
                        }}
                    >
                        <Box component={RouterLink} to={Constant.HOME_PATH} className="toolbar-logo">
                            <Box component="img" src={Constant.LOGOS_FILE_PATH + Constant.DEFAULT_LOGOS_FILE} className="fullsize" />
                        </Box>
                        <IconButton
                            edge="start"
                            color="primary"
                            aria-label="open drawer"
                            sx={{
                                ml: { lg: 8, sm: 4, xs: 2 },
                                mr: 3,
                            }}
                            onClick={() => {
                                appContext.setSideBar({ ...appContext.sidebar, open: !Boolean(appContext?.sidebar?.open) });
                            }}
                        >
                            {appContext?.sidebar?.open ? <MenuOpenIcon /> : <MenuIcon />}
                        </IconButton>
                    </Box>

                    <Box className="toolbar-right">
                        <Button
                            component="a"
                            size="small"
                            sx={{
                                marginLeft: 3,
                                '&:hover': {
                                    color: theme.palette.primary.main,
                                },
                            }}
                            variant="text"
                            color="primary"
                            href="/"
                            target="_blank"
                        >
                            <VisibilityIcon fontSize="small" />
                            <Typography className="toolbar-button-label">Voir le site</Typography>
                        </Button>

                        {debugParameter && (
                            <Button size="small" sx={{ marginLeft: 3 }} variant="text" color="error" onClick={() => navigate(Constant.PARAMETERS_BASE_PATH)}>
                                <PestControlIcon fontSize="small" />
                                <Typography className="toolbar-button-label">Mode débug</Typography>
                            </Button>
                        )}

                        {maintenanceParameter && (
                            <Button size="small" sx={{ marginLeft: 3 }} variant="text" color="warning" onClick={() => navigate(Constant.PARAMETERS_BASE_PATH)}>
                                <EngineeringIcon fontSize="small" />
                                <Typography className="toolbar-button-label">Mode maintenance</Typography>
                            </Button>
                        )}

                        <Box className="toolbar-userProfile">
                            <Component.NotificationsList />

                            {user && (
                                <ProfileButton size="small" sx={{ marginLeft: 3 }} component={RouterLink} to={`${Constant.USER_BASE_PATH}/${user?.id}${Constant.EDIT_PATH}`}>
                                    <PersonIcon />
                                </ProfileButton>
                            )}

                            <ProfileButton size="small" sx={{ marginLeft: 3 }} onClick={handleLogout}>
                                <LogoutIcon color="primary" />
                            </ProfileButton>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box
                className="layout-body"
                sx={{
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
                    className="layout-body-main"
                    sx={{
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
