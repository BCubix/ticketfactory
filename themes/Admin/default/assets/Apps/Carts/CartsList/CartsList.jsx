import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';
import { CardContent, Typography } from '@mui/material';

import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { TableColumn } from '@/AdminService/TableColumn';
import { cartsSelector, getCartsAction, changeCartsFilters } from '@Redux/carts/cartsSlice';

export const CartsList = () => {
    const { loading, carts, filters, total, error } = useSelector(cartsSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !carts && !error) {
            dispatch(getCartsAction());
        }
    }, []);

    return (
        <>
            <Component.CmtPageWrapper title={'Paniers'}>
                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <Component.CmtCardHeader
                        title={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography component="h2" variant="h5" sx={{ color: (theme) => theme.palette.primary.dark }}>
                                    Liste des paniers {carts && `(${(filters.page - 1) * filters.limit + 1} - ${(filters.page - 1) * filters.limit + carts.length} sur ${total})`}
                                </Typography>
                            </Box>
                        }
                    />
                    <CardContent>
                        <Component.CartsFilters filters={filters} changeFilters={(values) => dispatch(changeCartsFilters(values))} />

                        <Component.ListTable
                            table={TableColumn.CartsList}
                            list={carts}
                            filters={filters}
                            onClick={(itemId) => {
                                navigate(`${Constant.CARTS_BASE_PATH}/${itemId}`);
                            }}
                            onPreview={(item) => {
                                navigate(`${Constant.CARTS_BASE_PATH}/${item.id}`);
                            }}
                            changeFilters={(newFilters) => dispatch(changeCartsFilters(newFilters))}
                        />

                        <Component.CmtPagination
                            page={filters.page}
                            total={total}
                            limit={filters.limit}
                            setPage={(newValue) => dispatch(changeCartsFilters({ ...filters }, newValue))}
                            setLimit={(newValue) => {
                                dispatch(changeCartsFilters({ ...filters, limit: newValue }));
                            }}
                            length={carts?.length}
                        />
                    </CardContent>
                </Component.CmtCard>
            </Component.CmtPageWrapper>
        </>
    );
};
