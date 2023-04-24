import React from 'react';

import { Constant } from '@/AdminService/Constant';
import { Component } from '@/AdminService/Component';
import { CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';

export const CartPart = ({ cartRows }) => {
    return (
        <Grid item xs={12}>
            <Component.CmtCard sx={{ position: 'relative' }} overflow="hidden">
                <Component.CmtCardHeader title="Contenu du panier" />
                <CardContent sx={{ position: 'relative' }}>
                    <TableContainer>
                        <Table sx={{ minWidth: 650, marginTop: 5, transition: '.3s' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell width="35%">Produit</TableCell>
                                    <TableCell width="20%">Date</TableCell>
                                    <TableCell width="15%">Prix unitaire</TableCell>
                                    <TableCell width="15%">Quantité</TableCell>
                                    <TableCell width="15%">Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cartRows?.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell component="td" scope="row">
                                            <Link to={`${Constant.EVENTS_BASE_PATH}/${item?.eventId?.id}${Constant.EDIT_PATH}`} target="_blank">
                                                <Typography className="link" color="primary">
                                                    {item?.eventId?.name}
                                                </Typography>
                                            </Link>
                                        </TableCell>
                                        <TableCell component="td" scope="row">
                                            {item?.eventDateId?.eventDate}
                                        </TableCell>
                                        <TableCell component="td" scope="row">
                                            {item?.unitPrice?.toFixed(2)} €
                                        </TableCell>
                                        <TableCell component="td" scope="row">
                                            {item?.quantity}
                                        </TableCell>
                                        <TableCell component="td" scope="row">
                                            {item?.total?.toFixed(2)} €
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Box display="flex" justifyContent="space-between" p={4}>
                            <Typography component="span" fontWeight={500}>
                                Total
                            </Typography>
                            <Typography component="span" fontWeight={500}>
                                {cartRows?.reduce((partialSum, a) => partialSum + a.total, 0)?.toFixed(2)} €
                            </Typography>
                        </Box>
                    </TableContainer>
                </CardContent>
            </Component.CmtCard>
        </Grid>
    );
};
