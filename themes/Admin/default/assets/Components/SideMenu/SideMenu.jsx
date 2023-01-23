import React from 'react';
import { Link } from 'react-router-dom';
import {
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
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
                    backgroundColor: (theme) => theme.palette.cardBackground,
                    borderRight: '2px solid #FFC828',
                    paddingTop: 18,
                },
            }}
            variant="permanent"
        >
            {Menu.map((menu, index) => (
                <Box key={index}>
                    <Component.MenuTitle component="h1" sx={{ paddingLeft: 3 }}>
                        {menu.title}
                    </Component.MenuTitle>
                    <List>
                        {menu?.menu?.map((item, ind) => (
                            <ListItem disablePadding key={ind} sx={{ paddingLeft: 3 }}>
                                <ListItemButton
                                    component={Link}
                                    to={item.link || Constant.HOME_PATH}
                                >
                                    <ListItemIcon
                                        sx={{
                                            paddingLeft: 3,
                                            color: (theme) => theme.palette.picto.pictoColor,
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.name} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    {index < Menu.length - 1 && (
                        <Divider sx={{ backgroundColor: '#FFC828', height: '2px' }} />
                    )}
                </Box>
            ))}
        </Drawer>
    );
};
