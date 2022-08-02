import React from 'react';
import {
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { MenuTitle } from './sc.SideMenu';
import { EVENTS_BASE_PATH, USER_BASE_PATH } from '../../Constant';
import { useNavigate } from 'react-router-dom';

export const SideMenu = () => {
    let drawerWidth = 250;
    const navigate = useNavigate();

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    mt: 8,
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <MenuTitle component="h1" variant="h6">
                Paramètres
            </MenuTitle>
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate(EVENTS_BASE_PATH)}>
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Evènements'} />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <MenuTitle component="h1" variant="h6">
                Administration
            </MenuTitle>
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate(USER_BASE_PATH)}>
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Utilisateurs'} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    );
};
