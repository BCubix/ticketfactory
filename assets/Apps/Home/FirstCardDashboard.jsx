import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ArticleIcon from '@mui/icons-material/Article';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';

const FirstCardDashboard = ({ data }) => {
    const colorProps = '#02374D';

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
        <Card sx={{ position: 'relative' }}>
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
        </Card>
    );
};

export default FirstCardDashboard;
