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
import { MenuTitle } from './sc.SideMenu';
import {
    CATEGORIES_BASE_PATH,
    EVENTS_BASE_PATH,
    LOGS_BASE_PATH,
    ROOMS_BASE_PATH,
    SEASONS_BASE_PATH,
    USER_BASE_PATH,
} from '../../Constant';
import { useNavigate } from 'react-router-dom';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CategoryIcon from '@mui/icons-material/Category';
import BusinessIcon from '@mui/icons-material/Business';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import TocIcon from '@mui/icons-material/Toc';
import { Settings } from '@mui/icons-material';
import { Box } from '@mui/system';

const MENU = [
    {
        title: 'PROGRAMMATION',
        menu: [
            { name: 'Evènement', link: EVENTS_BASE_PATH, icon: <ConfirmationNumberIcon /> },
            { name: 'Catégories', link: CATEGORIES_BASE_PATH, icon: <CategoryIcon /> },
            { name: 'Caractéristiques', link: null, icon: <Settings /> },
            { name: 'Salles', link: ROOMS_BASE_PATH, icon: <BusinessIcon /> },
            { name: 'Saisons', link: SEASONS_BASE_PATH, icon: <AccessTimeIcon /> },
        ],
    },
    {
        title: 'PERSONNALISATION',
        menu: [
            { name: 'Menus', link: null, icon: <Settings /> },
            { name: 'Pages', link: null, icon: <Settings /> },
            { name: 'Redirections', link: null, icon: <Settings /> },
            { name: 'Modules', link: null, icon: <Settings /> },
            { name: 'Bibliothèque médias', link: null, icon: <Settings /> },
            { name: 'Contenus', link: null, icon: <Settings /> },
            { name: 'Types de contenus', link: null, icon: <Settings /> },
        ],
    },
    {
        title: 'ANALYSE',
        menu: [{ name: 'Statistiques', link: null, icon: <Settings /> }],
    },
    {
        title: 'ADMINISTRATION',
        menu: [
            { name: 'Paramètres', link: null, icon: <Settings /> },
            { name: 'Contacts', link: null, icon: <Settings /> },
            { name: 'Utilisateurs', link: USER_BASE_PATH, icon: <PersonIcon /> },
            { name: 'Logs', link: LOGS_BASE_PATH, icon: <TocIcon /> },
        ],
    },
];
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
            {MENU.map((menu, index) => (
                <Box key={index}>
                    <MenuTitle component="h1" variant="h6">
                        {menu.title}
                    </MenuTitle>
                    <List>
                        {menu?.menu?.map((item, ind) => (
                            <ListItem disablePadding key={ind}>
                                <ListItemButton
                                    onClick={() => {
                                        if (!item.link) {
                                            return;
                                        }

                                        navigate(item.link);
                                    }}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.name} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    {index < MENU.length - 1 && <Divider />}
                </Box>
            ))}
        </Drawer>
    );
};
