import React from 'react';
import { CardContent, Grid, Typography } from '@mui/material';
import moment from 'moment/moment';
import { Link } from 'react-router-dom';

import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

export const CustomerOrderPart = ({ customer }) => {
    return (
        <Grid item xs={12} md={5}>
            <Component.CmtCard sx={{ position: 'relative' }} overflow="hidden">
                <Component.CmtCardHeader title="Client" />
                <CardContent sx={{ position: 'relative' }}>
                    <Link to={`${Constant.CUSTOMERS_BASE_PATH}/${customer?.id}${Constant.EDIT_PATH}`}>
                        <Typography className="link" component="p" variant="h3" color="primary" mb={5}>
                            {customer?.civility} {customer?.firstName} {customer?.lastName}
                        </Typography>
                    </Link>

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
