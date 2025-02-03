import React from 'react';
import { useTheme } from '@emotion/react';
import { Component } from '@/AdminService/Component';

import { Grid, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import EventNoteIcon from '@mui/icons-material/EventNote';
import GroupIcon from '@mui/icons-material/Group';
import EmailIcon from '@mui/icons-material/Email';

export const GeneralInfos = ({generalInfos}) => {
    const theme = useTheme();
    
    const iconMap = {
        'Visiteurs en ligne': <VisibilityIcon fontSize="large" style={{ color: '#f48fb1', fontSize: 40 }} />,
        'Paniers actifs': <ShoppingBasketIcon fontSize="large" style={{ color: '#ffb74d', fontSize: 40 }} />,
        'Événements': <EventNoteIcon fontSize="large" style={{ color: '#9fa8da', fontSize: 40 }} />,
        'Clients': <GroupIcon fontSize="large" style={{ color: '#81c784', fontSize: 40 }} />,
        'Abonnés à la newsletter': <EmailIcon fontSize="large" style={{ color: '#f48fb1', fontSize: 40 }} />,
    };
    
    return (
        <Grid item xs={12}>
                    <Grid container spacing={6}>
                        {generalInfos.map((obj, index) => (
                            <Grid item xs={12} sm={true} key={index}>
                                <Component.CmtCard 
                                    style={{ display: 'flex',
                                        height:"100%",
                                      alignItems: 'center',
                                      padding: '10px',
                                      borderRadius: '10px', 
                                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        {iconMap[obj[0]]}
                                    </div>
                                    <div style={{ flex: 2}}>
                                        <Typography color="text.secondary" fontSize={12}>
                                            {obj[0]}
                                        </Typography>
                                        <Typography sx={{...theme.typography.h2}}>
                                            {obj[1]}
                                        </Typography>
                                    </div>
                                </Component.CmtCard>
                            </Grid>
                        ))}
                    </Grid>
        </Grid>
    );
};