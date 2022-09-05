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
    CONTENT_BASE_PATH,
    CONTENT_TYPES_BASE_PATH,
    EVENTS_BASE_PATH,
    LOGS_BASE_PATH,
    MEDIAS_BASE_PATH,
    ROOMS_BASE_PATH,
    SEASONS_BASE_PATH,
    USER_BASE_PATH,
} from '../../Constant';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';

import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CategoryIcon from '@mui/icons-material/Category';
import BusinessIcon from '@mui/icons-material/Business';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import TocIcon from '@mui/icons-material/Toc';
import MenuIcon from '@mui/icons-material/Menu';
import DescriptionIcon from '@mui/icons-material/Description';
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import SourceIcon from '@mui/icons-material/Source';
import WidgetsIcon from '@mui/icons-material/Widgets';
import SettingsIcon from '@mui/icons-material/Settings';
import EmailIcon from '@mui/icons-material/Email';

// import GridOnIcon from '@mui/icons-material/GridOn';
// { name: 'Caractéristiques', link: null, icon: <GridOnIcon /> },

const MENU = [
    {
        title: 'PROGRAMMATION',
        menu: [
            { name: 'Evènement', link: EVENTS_BASE_PATH, icon: <ConfirmationNumberIcon /> },
            { name: 'Catégories', link: CATEGORIES_BASE_PATH, icon: <CategoryIcon /> },
            { name: 'Salles', link: ROOMS_BASE_PATH, icon: <BusinessIcon /> },
            { name: 'Saisons', link: SEASONS_BASE_PATH, icon: <AccessTimeIcon /> },
        ],
    },
    {
        title: 'PERSONNALISATION',
        menu: [
            { name: 'Menus', link: null, icon: <MenuIcon /> },
            { name: 'Pages', link: null, icon: <DescriptionIcon /> },
            { name: 'Redirections', link: null, icon: <CallMissedOutgoingIcon /> },
            { name: 'Modules', link: null, icon: <ViewModuleIcon /> },
            { name: 'Bibliothèque médias', link: MEDIAS_BASE_PATH, icon: <PermMediaIcon /> },
            { name: 'Contenus', link: CONTENT_BASE_PATH, icon: <SourceIcon /> },
            { name: 'Types de contenus', link: CONTENT_TYPES_BASE_PATH, icon: <WidgetsIcon /> },
        ],
    },
    {
        title: 'ADMINISTRATION',
        menu: [
            { name: 'Paramètres', link: null, icon: <SettingsIcon /> },
            { name: 'Contacts', link: null, icon: <EmailIcon /> },
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
                overflow: 'auto',

                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    paddingTop: 16,
                },
            }}
            variant="permanent"
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
