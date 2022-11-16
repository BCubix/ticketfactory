import React from 'react';
import { Link } from 'react-router-dom';
import {
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { Box } from '@mui/system';

import { Constant } from '@/AdminService/Constant';
import { Component } from '@/AdminService/Component';
import { Menu } from '@/AdminService/Menu';

export const SideMenu = () => {
    let drawerWidth = 250;

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                overflow: 'auto',

                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    paddingTop: 16,
                },
            }}
            variant="permanent"
        >
            {Menu.map((menu, index) => (
                <Box key={index}>
                    <Component.MenuTitle component="h1" variant="h6">
                        {menu.title}
                    </Component.MenuTitle>
                    <List>
                        {menu?.menu?.map((item, ind) => (
                            <ListItem disablePadding key={ind}>
                                <ListItemButton component={Link} to={item.link || Constant.HOME_PATH}>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.name} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    {index < Menu.length - 1 && <Divider />}
                </Box>
            ))}
        </Drawer>
    );
};
