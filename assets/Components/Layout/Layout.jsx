import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { SideMenu } from '../SideMenu/SideMenu';

export const Layout = ({ children }) => {
    return (
        <Box>
            <AppBar position="fixed" sx={{ width: `100%` }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Ticket Factory
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{ display: 'flex' }}>
                <SideMenu />
                <Box component="main" sx={{ flexGrow: 1, mt: 8 }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};
