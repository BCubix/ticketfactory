import React from 'react';

import { Constant } from '@/AdminService/Constant';
import { Component } from '@/AdminService/Component';
import { CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';

export const CartPart = ({ cart }) => {
    return (
        <Grid item xs={12}>
            <Component.CmtCard sx={{ position: 'relative' }} overflow="hidden">
                <Component.CmtCardHeader title="Contenu du panier" />
                <CardContent sx={{ position: 'relative' }}>
                    <TableContainer>
                        <Table sx={{ minWidth: 650, marginTop: 5, transition: '.3s' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell width="20%">Evènement</TableCell>
                                    <TableCell width="25%">Noms</TableCell>
                                    <TableCell width="15%">Date</TableCell>
                                    <TableCell width="10%">Prix unitaire</TableCell>
                                    <TableCell width="10%">Quantité</TableCell>
                                    <TableCell width="10%">Réductions</TableCell>
                                    <TableCell width="10%">Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cart?.cartRows?.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell component="td" scope="row">
                                            <Link to={`${Constant.EVENTS_BASE_PATH}/${item?.eventId?.id}${Constant.EDIT_PATH}`} target="_blank">
                                                <Typography className="link" color="primary">
                                                    {item?.eventId?.name}
                                                </Typography>
                                            </Link>
                                        </TableCell>
                                        <TableCell component="td" scope="row">
                                            {item?.names?.map((it, ind) => (
                                                <Typography key={ind}>{it}</Typography>
                                            ))}
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
                                            {(item?.unitPrice * item?.quantity - item?.total).toFixed(2)} €
                                        </TableCell>
                                        <TableCell component="td" scope="row">
                                            {item?.total?.toFixed(2)} €
                                        </TableCell>
                                    </TableRow>
                                ))}

                                <TableRow sx={{ backgroundColor: (theme) => theme.palette.primary.light }}>
                                    <TableCell component="td" scope="row" colSpan={6}>
                                        <Typography component="span" fontWeight={500}>
                                            Sous-total
                                        </Typography>
                                    </TableCell>
                                    <TableCell component="td" scope="row" width="10%">
                                        <Typography component="span" fontWeight={500}>
                                            {cart?.cartRows?.reduce((partialSum, a) => partialSum + a.total, 0)?.toFixed(2)} €
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                                {cart?.vouchers.map((voucher, voucherIndex) => (
                                    <TableRow key={voucherIndex}>
                                        <TableCell component="td" scope="row" colSpan={6}>
                                            {voucher?.name}
                                        </TableCell>
                                        <TableCell component="td" scope="row">
                                            - {voucher?.discount} {voucher?.unit}
                                        </TableCell>
                                    </TableRow>
                                ))}

                                <TableRow sx={{ backgroundColor: (theme) => theme.palette.primary.light }}>
                                    <TableCell component="td" scope="row" colSpan={6}>
                                        <Typography component="span" fontWeight={500}>
                                            Total général
                                        </Typography>
                                    </TableCell>
                                    <TableCell component="td" scope="row">
                                        <Typography component="span" fontWeight={500}>
                                            {cart?.total?.toFixed(2)} €
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Component.CmtCard>
        </Grid>
    );
};
