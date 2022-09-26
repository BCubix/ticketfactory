import React from 'react';
import { Card, CardContent, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ArticleIcon from '@mui/icons-material/Article';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';

const FirstCardDashboard = ({ data }) => {
    const list = [
        { icon: <VisibilityIcon />, title: 'Visiteurs en ligne', info: data.onlineVisitors },
        { icon: <ShoppingBasketIcon />, title: 'Paniers actif', info: data.activeBaskets },
        { icon: <EventNoteIcon />, title: 'Evénements renseignés', info: data.recordedEvents },
        {
            icon: <ArticleIcon />,
            title: 'Clients & Newsletter',
            info: `${data.newsCustomers} / ...`,
        },
        {
            icon: <MedicalInformationIcon />,
            title: 'Etat de santé du site',
            info: `score: ${data.websiteHealth.score}, nombre d'erreurs: ${data.websiteHealth.nbErrors}, message: ${data.websiteHealth.message}`,
        },
    ];

    return (
        <Card>
            <CardContent>
                <List>
                    {list.map(({ icon, title, info }, index) => (
                        <ListItem key={`${title}-${index}`}>
                            <ListItemAvatar>{icon}</ListItemAvatar>
                            <ListItemText
                                primary={title}
                                secondary={info}
                                secondaryTypographyProps={{
                                    variant: 'body1',
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

export default FirstCardDashboard;
