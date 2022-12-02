import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { LayoutContext } from '@Components/CmtLayoutProvider/CmtLayoutProvider';

import { logoutAction } from '@Redux/profile/profileSlice';
import { ProfileButton } from './sc.ProfileButton';
import { useSelector } from 'react-redux';
import { profileSelector } from '../../redux/profile/profileSlice';

export const Layout = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(profileSelector);
    const sideBarContextValues = useContext(LayoutContext);

    const handleLogout = async () => {
        dispatch(logoutAction());

        navigate(Constant.LOGIN_PATH);
    };

    return (
        <Box>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: 1201,
                    height: '70px',
                    left: '0px',
                    right: '0px',
                    width: 'unset',
                    backgroundColor: (theme) => theme.palette.fourth.main,
                    boxShadow: '0',
                    borderBottom: (theme) => `2px solid ${theme.palette.secondary.main}`,
                }}
            >
                <Toolbar sx={{ height: '100%' }}>
                    <Box
                        component={Link}
                        to={Constant.HOME_PATH}
                        sx={{ height: '100%', paddingTop: 2, paddingBottom: 2, paddingLeft: 2 }}
                    >
                        <Box
                            component="img"
                            src={Constant.LOGOS_FILE_PATH + '/TicketFactoryJauneLogotypeHori.svg'}
                            height="100%"
                        />
                    </Box>
                    {user && (
                        <ProfileButton
                            size="small"
                            sx={{ marginLeft: 'auto' }}
                            component={Link}
                            to={`${Constant.USER_BASE_PATH}/${user?.id}${Constant.EDIT_PATH}`}
                        >
                            <PersonIcon />
                        </ProfileButton>
                    )}

                    <Button onClick={handleLogout}>
                        <LogoutIcon sx={{ color: (theme) => theme.palette.secondary.main }} />
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
