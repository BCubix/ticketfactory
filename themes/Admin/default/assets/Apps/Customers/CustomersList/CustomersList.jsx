import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';
import { CardContent, Typography } from '@mui/material';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { TableColumn } from '@/AdminService/TableColumn';
import { customersSelector, getCustomersAction, changeCustomersFilters } from '@Redux/customers/customersSlice';

export const CustomersList = () => {
    const { loading, customers, filters, total, error } = useSelector(customersSelector);
    const [deleteDialog, setDeleteDialog] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !customers && !error) {
            dispatch(getCustomersAction());
        }
    }, []);

    const handleDelete = async (id) => {
        await Api.customersApi.deleteCustomer(id);
        dispatch(getCustomersAction());
        setDeleteDialog(null);
    };

    return (
        <>
            <Component.CmtPageWrapper title={'Clients'}>
                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <Component.CmtCardHeader
                        title={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography component="h2" variant="h5" sx={{ color: (theme) => theme.palette.primary.dark }}>
                                    Liste des clients{' '}
                                    {customers && `(${(filters.page - 1) * filters.limit + 1} - ${(filters.page - 1) * filters.limit + customers.length} sur ${total})`}
                                </Typography>
                                <Component.CreateButton variant="contained" onClick={() => navigate(Constant.CUSTOMERS_BASE_PATH + Constant.CREATE_PATH)}>
                                    Nouveau
                                </Component.CreateButton>
                            </Box>
                        }
                    />
                    <CardContent>
                        <Component.CustomersFilters filters={filters} changeFilters={(values) => dispatch(changeCustomersFilters(values))} />

                        <Component.ListTable
                            table={TableColumn.CustomersList}
                            list={customers}
                            onEdit={(id) => {
                                navigate(`${Constant.CUSTOMERS_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                            filters={filters}
                            changeFilters={(newFilters) => dispatch(changeCustomersFilters(newFilters))}
                        />

                        <Component.CmtPagination
                            page={filters.page}
                            total={total}
                            limit={filters.limit}
                            setPage={(newValue) => dispatch(changeCustomersFilters({ ...filters }, newValue))}
                            setLimit={(newValue) => {
                                dispatch(changeCustomersFilters({ ...filters, limit: newValue }));
                            }}
                            length={customers?.length}
                        />
                    </CardContent>
                </Component.CmtCard>
            </Component.CmtPageWrapper>
            <Component.DeleteDialog open={deleteDialog ? true : false} onCancel={() => setDeleteDialog(null)} onDelete={() => handleDelete(deleteDialog)}>
                <Box textAlign="center" py={3}>
                    <Typography component="p">Êtes-vous sûr de vouloir supprimer ce client ?</Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
        </>
    );
};
