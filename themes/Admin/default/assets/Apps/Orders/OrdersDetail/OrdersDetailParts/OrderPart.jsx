import { CardContent, Chip, Grid, Typography } from '@mui/material';
import React from 'react';

import { Component } from '@/AdminService/Component';

export const OrderPart = ({ order }) => {
    return (
        <Grid item xs={12} md={7}>
            <Component.CmtCard sx={{ position: 'relative' }} overflow="hidden">
                <Component.CmtCardHeader title="Commande" />
                <CardContent sx={{ position: 'relative' }}>
                    <Typography>
                        Référence :{' '}
                        <Typography component="span" fontWeight="bold">
                            {order?.reference}
                        </Typography>
                    </Typography>

                    <Typography>
                        Etat : <Chip size="small" sx={{ backgroundColor: order?.status.color }} label={order?.status.name} />
                    </Typography>
                </CardContent>
            </Component.CmtCard>
        </Grid>
    );
};
