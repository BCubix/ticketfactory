import React from 'react';
import { Link } from 'react-router-dom';

import { Constant } from '@/AdminService/Constant';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useMemo } from 'react';

export const CartEventPart = ({ cart, calculateDiscount, calculateTotal, subscriptionUsageDiscount }) => {
    const eventSubTotal = useMemo(() => cart?.eventRows?.reduce((partialSum, a) => partialSum + a.total, 0)?.toFixed(2), []);

    return (
        <Box className="cart_element_wrapper">
            <Typography component="h2" variant="h3" fontWeight={500}>
                Événements
            </Typography>
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
                                        <Link to={`${Constant.EVENTS_BASE_PATH}/${item?.event?.id}${Constant.EDIT_PATH}`} target="_blank">
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

                        {subscriptionUsageDiscount > 0 && (
                            <TableRow sx={{ backgroundColor: (theme) => theme.palette.primary.light }}>
                                <TableCell component="td" scope="row" colSpan={5}>
                                    <Typography component="span" fontWeight={500}>
                                        Réduction abonnement
                                    </Typography>
                                </TableCell>
                                <TableCell component="td" scope="row" colSpan={1}>
                                    <Typography component="span" fontWeight={500}>
                                        {subscriptionUsageDiscount} €
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}

                        <TableRow sx={{ backgroundColor: (theme) => theme.palette.primary.light }}>
                            <TableCell component="td" scope="row" colSpan={5}>
                                <Typography component="span" fontWeight={500}>
                                    Sous-total
                                </Typography>
                            </TableCell>
                            <TableCell component="td" scope="row" colSpan={1}>
                                <Typography component="span" fontWeight={500}>
                                    {eventSubTotal - subscriptionUsageDiscount} €
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
