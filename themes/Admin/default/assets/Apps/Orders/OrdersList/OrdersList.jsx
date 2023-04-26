import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';
import { CardContent, Typography } from '@mui/material';

import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { TableColumn } from '@/AdminService/TableColumn';
import { ordersSelector, getOrdersAction, changeOrdersFilters } from '@Redux/orders/ordersSlice';

export const OrdersList = () => {
    const { loading, orders, filters, total, error } = useSelector(ordersSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !orders && !error) {
            dispatch(getOrdersAction());
        }
    }, []);

    return (
        <>
            <Component.CmtPageWrapper title={'Commandes'}>
                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <Component.CmtCardHeader
                        title={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography component="h2" variant="h5" sx={{ color: (theme) => theme.palette.primary.dark }}>
                                    Liste des commandes{' '}
                                    {orders && `(${(filters.page - 1) * filters.limit + 1} - ${(filters.page - 1) * filters.limit + orders.length} sur ${total})`}
                                </Typography>
                            </Box>
                        }
                    />
                    <CardContent>
                        <Component.OrdersFilters filters={filters} changeFilters={(values) => dispatch(changeOrdersFilters(values))} />

                        <Component.ListTable
                            table={TableColumn.OrdersList}
                            list={orders}
                            filters={filters}
                            onClick={(itemId) => {
                                navigate(`${Constant.ORDERS_BASE_PATH}/${itemId}`);
                            }}
                            onPreview={(item) => {
                                navigate(`${Constant.ORDERS_BASE_PATH}/${item.id}`);
                            }}
                            changeFilters={(newFilters) => dispatch(changeOrdersFilters(newFilters))}
                        />

                        <Component.CmtPagination
                            page={filters.page}
                            total={total}
                            limit={filters.limit}
                            setPage={(newValue) => dispatch(changeOrdersFilters({ ...filters }, newValue))}
                            setLimit={(newValue) => {
                                dispatch(changeOrdersFilters({ ...filters, limit: newValue }));
                            }}
                            length={orders?.length}
                        />
                    </CardContent>
                </Component.CmtCard>
            </Component.CmtPageWrapper>
        </>
    );
};
