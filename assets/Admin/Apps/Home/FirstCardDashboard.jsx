import React from 'react';

import { useTheme } from '@emotion/react';

import ArticleIcon from '@mui/icons-material/Article';
import EventNoteIcon from '@mui/icons-material/EventNote';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import {
    CardContent,
    CardHeader,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
} from '@mui/material';

import { Component } from '@/AdminService/Component';

export const FirstCardDashboard = ({ data }) => {
    const theme = useTheme();
    const colorProps = theme.palette.secondary.main;

    const list = [
        {
            icon: <VisibilityIcon sx={{ color: colorProps }} />,
            title: 'Visiteurs en ligne',
            info: data.onlineVisitors,
        },
        {
            icon: <ShoppingBasketIcon sx={{ color: colorProps }} />,
            title: 'Paniers actif',
            info: data.activeBaskets,
        },
        {
            icon: <EventNoteIcon sx={{ color: colorProps }} />,
            title: 'Evénements renseignés',
            info: data.recordedEvents,
        },
        {
            icon: <ArticleIcon sx={{ color: colorProps }} />,
            title: 'Clients & Newsletter',
            info: `${data.newsCustomers} / ...`,
        },
        {
            icon: <MedicalInformationIcon sx={{ color: colorProps }} />,
            title: 'Etat de santé du site',
            info: `score: ${data.websiteHealth.score}, nombre d'erreurs: ${data.websiteHealth.nbErrors}, message: ${data.websiteHealth.message}`,
        },
    ];

    return (
        <Component.CmtCard sx={{ position: 'relative' }} overflow="hidden">
            <CardHeader
                title="Informations générales"
                titleTypographyProps={{
                    fontWeight: 600,
                    fontSize: 16,
                    color: '#FFFFFF',
                }}
                sx={{ borderBottom: 1, borderBottomColor: 'divider', backgroundColor: colorProps }}
            />
            <CardContent sx={{ position: 'relative', p: 0 }}>
                <List disablePadding>
                    {list.map(({ icon, title, info }, index) => (
                        <ListItemButton
                            key={`${title}-${index}`}
                            component={'li'}
                            sx={{
                                p: (theme) => theme.spacing(1, 5),
                                borderBottom: 1,
                                borderBottomColor: 'divider',

                                '&:last-child': {
                                    borderBottomColor: 'transparent',
                                },
                            }}
                        >
                            <ListItemAvatar>{icon}</ListItemAvatar>
                            <ListItemText
                                primary={title}
                                secondary={info}
                                primaryTypographyProps={{
                                    fontWeight: 600,
                                }}
                                secondaryTypographyProps={{
                                    variant: 'body1',
                                }}
                            />
                        </ListItemButton>
                    ))}
                </List>
            </CardContent>
        </Component.CmtCard>
    );
};
