import React, { useMemo } from 'react';

import { Component } from '@/AdminService/Component';
import { CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';

export const CartPart = ({ cart }) => {
    const subscriptionUsageDiscount = useMemo(
        () => cart?.linkedOrder?.subscriptionUsages?.reduce((total, subscriptionUsage) => total + subscriptionUsage?.eventSeat?.eventPrice?.price, 0)?.toFixed(2),
        []
    );

    const generalTotal = useMemo(() => {
        let total = (cart.total || 0) - subscriptionUsageDiscount;

        return total >= 0 ? total : 0;
    }, []);

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
                    {cart.eventRows?.length > 0 && (
                        <Component.CartEventPart
                            cart={cart}
                            calculateDiscount={calculateDiscount}
                            calculateTotal={calculateTotal}
                            subscriptionUsageDiscount={subscriptionUsageDiscount}
                        />
                    )}
                    {cart.productRows?.length > 0 && <Component.CartProductPart cart={cart} calculateDiscount={calculateDiscount} calculateTotal={calculateTotal} />}
                    {cart.subscriptionRows?.length > 0 && <Component.CartSubscriptionPart cart={cart} calculateDiscount={calculateDiscount} calculateTotal={calculateTotal} />}

                    <TableContainer>
                        <Table sx={{ minWidth: 650, marginTop: 10, transition: '.3s' }}>
                            <TableBody>
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
                                    <TableCell component="td" scope="row" with="90%">
                                        <Typography component="span" fontWeight={500}>
                                            Total général
                                        </Typography>
                                    </TableCell>
                                    <TableCell component="td" scope="row" width="10%">
                                        <Typography component="span" fontWeight={500}>
                                            {generalTotal.toFixed(2)} €
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
