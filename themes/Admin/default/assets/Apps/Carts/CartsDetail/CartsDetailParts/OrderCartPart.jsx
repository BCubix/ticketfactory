import React from 'react';
import { CardContent, Grid, Typography } from '@mui/material';

import { Component } from '@/AdminService/Component';
import moment from 'moment/moment';

const DisplayOrderInfos = ({ order }) => {
    if (!order) {
        return (
            <Typography component="p" variant="h4">
                Aucune commande n'a été crée pour le moment.
            </Typography>
        );
    }

    return (
        <Box>
            <Typography component="p" variant="h3">
                Commande n°{order.id}
            </Typography>

            <Typography>
                Crée le :{' '}
                <Typography component="span" fontWeight="bold">
                    {moment(order.createdAt).format('DD/MM/YYYY HH:mm')}
                </Typography>
            </Typography>
        </Box>
    );
};

export const OrderCartPart = ({ order }) => {
    return (
        <Grid item xs={12} md={7}>
            <Component.CmtCard sx={{ position: 'relative' }} overflow="hidden">
                <Component.CmtCardHeader title="Commande" />
                <CardContent sx={{ position: 'relative' }}>
                    <DisplayOrderInfos order={order} />
                </CardContent>
            </Component.CmtCard>
        </Grid>
    );
};
