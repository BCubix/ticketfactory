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

import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import useAppContext from '@/Config/useAppContext';
import { logoutAction, profileSelector } from '@Apps/Auth/redux/profile/profileSlice';
import { parametersSelector } from '@Apps/Parameters/redux/parameters/parametersSlice';
import { ProfileButton } from './sc.ProfileButton';

export const Layout = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(profileSelector);
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
                <Toolbar
                    sx={{
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        px: { lg: 6, xs: 4 },
                        backgroundColor: (theme) => theme.palette.secondary.light,
                        boxShadow: '5px 0 10px rgba(0, 0, 0, 0.085)',
                    }}
                >
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

                    <Box display="flex">
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
                            <Typography pl={3} fontSize={12}>
                                Voir le site
                            </Typography>
                        </Button>

                        {debugParameter && (
                            <Button size="small" sx={{ marginLeft: 3, fontSize: 12 }} variant="text" color="error" onClick={() => navigate(Constant.PARAMETERS_BASE_PATH)}>
                                <PestControlIcon fontSize="small" />
                                <Typography pl={3} fontSize={12}>
                                    Mode débug
                                </Typography>
                            </Button>
                        )}

                        {maintenanceParameter && (
                            <Button size="small" sx={{ marginLeft: 3, fontSize: 12 }} variant="text" color="warning" onClick={() => navigate(Constant.PARAMETERS_BASE_PATH)}>
                                <EngineeringIcon fontSize="small" />
                                <Typography pl={3} fontSize={12}>
                                    Mode maintenance
                                </Typography>
                            </Button>
                        )}

                        <Box display="flex" ml={20}>
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
