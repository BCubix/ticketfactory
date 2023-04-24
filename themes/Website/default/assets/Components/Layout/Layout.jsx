import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, IconButton, Toolbar } from '@mui/material';
import { Box } from '@mui/system';

import { Constant } from '@Website/WebsiteService/Constant';

import { ProfileButton } from './sc.ProfileButton';
import { useTheme } from '@emotion/react';

export const Layout = ({ children }) => {
    const theme = useTheme();

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
                    </Box>
                </Toolbar>
            </AppBar>

            <Box
                sx={{
                    display: 'flex',
                    minWidth: 0,
                    flex: 1,
                    minHeight: '100%',
                    margin: 0,
                    transition: (theme) => theme.transitions.create(['margin-left']),
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        minWidth: 0,
                        flex: 1,
                        flexGrow: 1,
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
