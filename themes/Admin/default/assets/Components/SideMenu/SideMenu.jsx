import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Drawer, Link, List, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Constant } from '@/AdminService/Constant';
import { Component } from '@/AdminService/Component';
import { Menu } from '@/AdminService/Menu';
import { useTheme } from '@emotion/react';

export const SideMenu = ({ sidebarWidth, sidebarOpen, headerHeight, closeSidebar }) => {
    const { pathname } = useLocation();
    const theme = useTheme();

    const checkPath = (path, relatedLinks) => {
        let p = pathname?.split('/')?.at(2);

        if (p === path?.split('/')?.at(2)) {
            return true;
        }

        if (!relatedLinks) {
            return false;
        }

        return relatedLinks?.some((el) => el.split('/')?.at(2) === p);
    };

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
            onClick={() => {
                if (innerWidth < theme.breakpoints.values.sm) {
                    closeSidebar();
                }
            }}
        >
            <Box sx={{ overflow: 'auto', height: '100%' }}>
                <List disablePadding sx={{ mr: 2, pb: 2 }}>
                    {Menu.filter((el) => el.menu.length > 0).map((menu, index) => (
                        <Box key={index}>
                            <Component.MenuTitle component="li" disableSticky>
                                <Typography variant="h2" fontSize={12} className="menus-title">
                                    {menu.title}
                                </Typography>
                            </Component.MenuTitle>
                            {menu?.menu
                                ?.sort((itemA, itemB) => itemA?.position > itemB?.position)
                                ?.map((item, ind) => {
                                    if (item.link || item.linkList?.length > 0) {
                                        return (
                                            <Component.MenuItemButton component="li" key={ind} isActive={checkPath(item.link, item?.relatedLinks)}>
                                                <Link
                                                    underline={'none'}
                                                    component={RouterLink}
                                                    to={item.link || item.linkList?.sort((a, b) => a.position > b.position)[0]?.link || Constant.HOME_PATH}
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
                                        );
                                    }

                                    return <React.Fragment key={ind} />;
                                })}
                        </Box>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};
