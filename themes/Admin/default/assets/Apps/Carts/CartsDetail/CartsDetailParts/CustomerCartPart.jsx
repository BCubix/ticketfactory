import React from 'react';

import { Component } from '@/AdminService/Component';
import { CardContent, Grid, Typography } from '@mui/material';
import moment from 'moment/moment';
import { Link } from 'react-router-dom';

export const CustomerCartPart = ({ customer }) => {
    return (
        <Grid item xs={12}>
            <Component.CmtCard sx={{ position: 'relative' }} overflow="hidden">
                <Component.CmtCardHeader title="Informations client" />
                <CardContent sx={{ position: 'relative' }}>
                    <Typography component="p" variant="h3" color="primary" mb={5}>
                        {customer?.civility} {customer?.firstName} {customer?.lastName}
                    </Typography>

                    <Typography>
                        Email :{' '}
                        <Link to={`mailto:${customer.email}`}>
                            <Typography component="span" fontWeight="bold" className="link" color="primary">
                                {customer.email}
                            </Typography>
                        </Link>
                    </Typography>
                    <Typography>
                        Compte crée le :{' '}
                        <Typography component="span" fontWeight="bold">
                            {moment(customer.createdAt).format('DD/MM/YYYY HH:mm')}
                        </Typography>
                    </Typography>
                </CardContent>
            </Component.CmtCard>
        </Grid>
    );
};
