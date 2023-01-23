import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Drawer, Link, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import { alpha, Box } from '@mui/system';

import { Constant } from '@/AdminService/Constant';
import { Component } from '@/AdminService/Component';
import { Menu } from '@/AdminService/Menu';

const menuBefore = {
    left: 0,
    top: 0,
    content: `''`,
    position: 'absolute',
    display: 'inline-block',
    width: '4px',
    height: '100%',
    backgroundColor: 'transparent',
};

export const SideMenu = () => {
    const location = useLocation();
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
            <List disablePadding sx={{ mr: 2, pb: 2 }}>
                {Menu.map((menu, index) => (
                    <Box key={index}>
                        <Component.MenuTitle component="li" disableSticky>
                            {menu.title}
                        </Component.MenuTitle>
                        <List>
                            {menu?.menu?.map((item, ind) => (
                                <Component.MenuItemButton component="li" key={ind} isActive={location.pathname === item.link}>
                                    <Link
                                        underline={'none'}
                                        component={RouterLink}
                                        to={item.link || Constant.HOME_PATH}
                                        sx={{
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            overflow: 'hidden',
                                            position: 'relative',
                                            color: 'inherit',
                                            p: (theme) => theme.spacing(2, 3.75),
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>{item.icon}</ListItemIcon>
                                        <ListItemText
                                            primary={item.name}
                                            sx={{
                                                m: 0,
                                                '& .MuiTypography-root': {
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                },
                                            }}
                                        />
                                    </Link>
                                </Component.MenuItemButton>
                            ))}
                        </List>
                    </Box>
                ))}
            </List>
        </Drawer>
    );
};
