import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Drawer, IconButton, Link, List, ListItemIcon, ListItemText, Zoom } from '@mui/material';
import { Box } from '@mui/system';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

import { Constant } from '@/AdminService/Constant';
import { Component } from '@/AdminService/Component';
import { Menu } from '@/AdminService/Menu';

export const SideMenu = ({ sidebarWidth, sidebarOpen, closeSidebar }) => {
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
                },
            }}
            variant="permanent"
            open={sidebarOpen}
            transitionDuration={300}
            ModalProps={{
                keepMounted: true,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingInline: 7, paddingBlock: 4, minHeight: 80 }}>
                <Box component={RouterLink} to={Constant.HOME_PATH} height="100%">
                    <Box component="img" src={Constant.LOGOS_FILE_PATH + Constant.DEFAULT_LOGOS_FILE} height="100%" />
                </Box>
                <Zoom in={sidebarOpen}>
                    <IconButton edge="start" color="inherit" aria-label="open drawer" sx={{ ml: 0, mr: -1.5 }} onClick={() => closeSidebar()}>
                        <MenuOpenIcon />
                    </IconButton>
                </Zoom>
            </Box>

            <Box sx={{ overflow: 'auto', height: '100%' }}>
                <List disablePadding sx={{ mr: 2, pb: 2 }}>
                    {Menu.map((menu, index) => (
                        <Box key={index}>
                            <Component.MenuTitle component="li" disableSticky>
                                {menu.title}
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
