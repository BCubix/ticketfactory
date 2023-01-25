import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Drawer, Link, List, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Constant } from '@/AdminService/Constant';
import { Component } from '@/AdminService/Component';
import { Menu } from '@/AdminService/Menu';

export const SideMenu = ({ sidebarWidth, sidebarOpen, headerHeight }) => {
    const location = useLocation();

    return (
        <Drawer
            sx={{
                '& .MuiDrawer-paper': {
                    border: 'none',
                    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.085)',
                    transition: (theme) => theme.transitions.create(['width']),
                    width: sidebarWidth,
                    overflow: 'hidden',
                    paddingRight: 0,
                    height: `calc(100% - ${headerHeight}px)`,
                    marginTop: `${headerHeight}px`,
                },
            }}
            variant="permanent"
            open={sidebarOpen}
            transitionDuration={300}
            ModalProps={{
                keepMounted: true,
            }}
        >
            <Box sx={{ overflow: 'auto', height: '100%' }}>
                <List disablePadding sx={{ mr: 2, pb: 2 }}>
                    {Menu.map((menu, index) => (
                        <Box key={index}>
                            <Component.MenuTitle component="li" disableSticky>
                                <Typography variant="h2" fontSize={12}>
                                    {menu.title}
                                </Typography>
                            </Component.MenuTitle>
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
                                            p: (theme) => theme.spacing(2, 7),
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
                        </Box>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};
