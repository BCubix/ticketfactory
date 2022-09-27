import React, { useContext } from 'react';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { SideMenu } from '../SideMenu/SideMenu';
import LogoutIcon from '@mui/icons-material/Logout';
import { logoutAction } from '../../redux/profile/profileSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HOME_PATH, LOGIN_PATH } from '../../Constant';
import { LayoutContext } from '../CmtLayoutProvider/CmtLayoutProvider';

export const Layout = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sideBarContextValues = useContext(LayoutContext);

    const handleLogout = async () => {
        dispatch(logoutAction());

        navigate(LOGIN_PATH);
    };

    return (
        <Box>
            <AppBar position="fixed" sx={{ width: `100%`, zIndex: 1201 }}>
                <Toolbar>
                    <Button
                        variant="text"
                        onClick={() => navigate(HOME_PATH)}
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
                <SideMenu />
                <Box component="main" sx={{ flexGrow: 1, marginTop: '64px' }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};
