import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import LogoutIcon from '@mui/icons-material/Logout';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { LayoutContext } from "@Components/CmtLayoutProvider/CmtLayoutProvider";

import { logoutAction } from '@Redux/profile/profileSlice';

export const Layout = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sideBarContextValues = useContext(LayoutContext);

    const handleLogout = async () => {
        dispatch(logoutAction());

        navigate(Constant.LOGIN_PATH);
    };

    return (
        <Box>
            <AppBar position="fixed" sx={{ width: `100%`, zIndex: 1201 }}>
                <Toolbar>
                    <Button
                        component={Link}
                        to={Constant.HOME_PATH}
                        variant="text"
                        sx={{ color: '#FFFFFF' }}
                    >
                        <Typography variant="h2" component="div">
                            Ticket Factory
                        </Typography>
                    </Button>

                    <Button onClick={handleLogout} sx={{ marginLeft: 'auto' }}>
                        <LogoutIcon sx={{ color: '#FFFFFF' }} />
                    </Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ display: 'flex' }}>
                <Component.SideMenu />
                <Box component="main" sx={{ flexGrow: 1, marginTop: '64px' }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};
