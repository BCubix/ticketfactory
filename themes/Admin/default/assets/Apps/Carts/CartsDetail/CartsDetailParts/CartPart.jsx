import React from 'react';

import { Constant } from '@/AdminService/Constant';
import { Component } from '@/AdminService/Component';
import { CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export const CartPart = ({ cart }) => {
    const calculateTotal = (price, discount, unit) => {
        if (!discount || !unit) {
            return price;
        }

        let discountAmount = discount;
        if (unit === '%') {
            discountAmount = (price / 100) * discount;
        }

        return price - discountAmount;
    };

    const calculateDiscount = (price, discount, unit) => {
        if (!discount || !unit) {
            return '';
        }

        if (unit === '€') {
            return discount;
        }

        return (price / 100) * discount;
    };

    return (
        <Grid item xs={12}>
            <Component.CmtCard sx={{ position: 'relative' }} overflow="hidden">
                <Component.CmtCardHeader title="Contenu du panier" />
                <CardContent sx={{ position: 'relative' }}>
                    <TableContainer>
                        <Table sx={{ minWidth: 650, marginTop: 5, transition: '.3s' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell width="25%">Evènement</TableCell>
                                    <TableCell width="25%">Placement</TableCell>
                                    <TableCell width="20%">Date</TableCell>
                                    <TableCell width="10%">Prix unitaire</TableCell>
                                    <TableCell width="10%">Réductions</TableCell>
                                    <TableCell width="10%">Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cart?.eventRows?.map((item, index) => {
                                    return item.eventSeats?.map((seat, ind) => (
                                        <TableRow key={ind}>
                                            <TableCell component="td" scope="row">
                                                <Link to={`${Constant.EVENTS_BASE_PATH}/${item?.eventId?.id}${Constant.EDIT_PATH}`} target="_blank">
                                                    <Typography className="link" color="primary">
                                                        {item?.event?.name}
                                                    </Typography>
                                                </Link>
                                            </TableCell>
                                            <TableCell component="td" scope="row">
                                                <Typography>{seat.eventPrice.name}</Typography>
                                            </TableCell>
                                            <TableCell component="td" scope="row">
                                                {item?.eventDate?.eventDate}
                                            </TableCell>
                                            <TableCell component="td" scope="row">
                                                {seat?.eventPrice?.price?.toFixed(2)} €
                                            </TableCell>
                                            <TableCell component="td" scope="row">
                                                {seat?.voucher
                                                    ? `${seat?.voucher?.discount?.toFixed(2)} ${seat?.voucher?.unitPrice} (${calculateDiscount(
                                                          seat?.eventPrice?.total,
                                                          seat?.voucher?.discount,
                                                          seat?.voucher?.unitPrice
                                                      )})`
                                                    : '---'}
                                            </TableCell>
                                            <TableCell component="td" scope="row">
                                                {calculateTotal(seat?.eventPrice?.price, seat?.voucher?.discount, seat?.voucher?.unitPrice).toFixed(2)} €
                                            </TableCell>
                                        </TableRow>
                                    ));
                                })}

                                <TableRow sx={{ backgroundColor: (theme) => theme.palette.primary.light }}>
                                    <TableCell component="td" scope="row" colSpan={5}>
                                        <Typography component="span" fontWeight={500}>
                                            Sous-total
                                        </Typography>
                                    </TableCell>
                                    <TableCell component="td" scope="row" width="10%">
                                        <Typography component="span" fontWeight={500}>
                                            {cart?.eventRows?.reduce((partialSum, a) => partialSum + a.total, 0)?.toFixed(2)} €
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                                {cart?.vouchers.map((voucher, voucherIndex) => (
                                    <TableRow key={voucherIndex}>
                                        <TableCell component="td" scope="row" colSpan={5}>
                                            {voucher?.name}
                                        </TableCell>
                                        <TableCell component="td" scope="row">
                                            - {voucher?.discount} {voucher?.unit}
                                        </TableCell>
                                    </TableRow>
                                ))}

                                <TableRow sx={{ backgroundColor: (theme) => theme.palette.primary.light }}>
                                    <TableCell component="td" scope="row" colSpan={5}>
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
