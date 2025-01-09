import React from 'react';
import { Link } from 'react-router-dom';

import { Constant } from '@/AdminService/Constant';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useMemo } from 'react';

export const CartProductPart = ({ cart, calculateDiscount, calculateTotal }) => {
    const productSubTotal = useMemo(() => cart?.productRows?.reduce((partialSum, a) => partialSum + a.total, 0)?.toFixed(2), []);

    return (
        <Box className="cart_element_wrapper">
            <Typography component="h2" variant="h3" fontWeight={500}>
                Produits
            </Typography>
            <TableContainer>
                <Table sx={{ minWidth: 650, marginTop: 5, transition: '.3s' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell width="35%">Produit</TableCell>
                            <TableCell width="35%">quantité</TableCell>
                            <TableCell width="10%">Prix unitaire</TableCell>
                            <TableCell width="10%">Réductions</TableCell>
                            <TableCell width="10%">Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cart?.productRows?.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell component="td" scope="row">
                                    <Link to={`${Constant.PRODUCTS_BASE_PATH}/${item?.product?.id}${Constant.EDIT_PATH}`} target="_blank">
                                        <Typography className="link" color="primary">
                                            {item?.product?.name}
                                        </Typography>
                                    </Link>
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    <Typography>{item.quantity}</Typography>
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {item?.product?.price?.toFixed(2)} €
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {item?.voucher
                                        ? `${item?.voucher?.discount?.toFixed(2)} ${item?.voucher?.unitPrice} (${calculateDiscount(
                                              item?.product?.total,
                                              item?.voucher?.discount,
                                              item?.voucher?.unitPrice
                                          )})`
                                        : '---'}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {calculateTotal(item?.product?.price, item?.voucher?.discount, item?.voucher?.unitPrice)?.toFixed(2)} €
                                </TableCell>
                            </TableRow>
                        ))}

                        <TableRow sx={{ backgroundColor: (theme) => theme.palette.primary.light }}>
                            <TableCell component="td" scope="row" colSpan={4}>
                                <Typography component="span" fontWeight={500}>
                                    Sous-total
                                </Typography>
                            </TableCell>
                            <TableCell component="td" scope="row" width="10%">
                                <Typography component="span" fontWeight={500}>
                                    {productSubTotal} €
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
