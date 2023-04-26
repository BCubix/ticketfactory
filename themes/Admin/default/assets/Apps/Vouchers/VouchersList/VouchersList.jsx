import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { CardContent, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { TableColumn } from '@/AdminService/TableColumn';

import { changeVouchersFilters, getVouchersAction, vouchersSelector } from '@Redux/vouchers/vouchersSlice';

export const VouchersList = () => {
    const { loading, vouchers, filters, total, error } = useSelector(vouchersSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !vouchers && !error) {
            dispatch(getVouchersAction());
        }
    }, []);

    const handleDelete = async (id) => {
        await Api.vouchersApi.deleteVoucher(id);

        dispatch(getVouchersAction());

        setDeleteDialog(null);
    };

    return (
        <>
            <Component.CmtPageWrapper title={'Réductions'}>
                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <Component.CmtCardHeader
                        title={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography component="h2" variant="h5" sx={{ color: (theme) => theme.palette.primary.dark }}>
                                    Liste des réductions{' '}
                                    {vouchers && `(${(filters.page - 1) * filters.limit + 1} - ${(filters.page - 1) * filters.limit + vouchers.length} sur ${total})`}
                                </Typography>
                                <Component.CreateButton variant="contained" onClick={() => navigate(Constant.VOUCHERS_BASE_PATH + Constant.CREATE_PATH)}>
                                    Nouveau
                                </Component.CreateButton>
                            </Box>
                        }
                    />
                    <CardContent>
                        <Component.VouchersFilters filters={filters} changeFilters={(values) => dispatch(changeVouchersFilters(values))} />

                        <Component.ListTable
                            table={TableColumn.VouchersList}
                            list={vouchers}
                            onEdit={(id) => {
                                navigate(`${Constant.VOUCHERS_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                            filters={filters}
                            changeFilters={(newFilters) => dispatch(changeVouchersFilters(newFilters))}
                        />

                        <Component.CmtPagination
                            page={filters.page}
                            total={total}
                            limit={filters.limit}
                            setPage={(newValue) => dispatch(changeVouchersFilters({ ...filters }, newValue))}
                            setLimit={(newValue) => {
                                dispatch(changeVouchersFilters({ ...filters, limit: newValue }));
                            }}
                            length={vouchers?.length}
                        />
                    </CardContent>
                </Component.CmtCard>
            </Component.CmtPageWrapper>
            <Component.DeleteDialog open={deleteDialog ? true : false} onCancel={() => setDeleteDialog(null)} onDelete={() => handleDelete(deleteDialog)}>
                <Box textAlign="center" py={3}>
                    <Typography component="p">Êtes-vous sûr de vouloir supprimer cet utilisateur ?</Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
        </>
    );
};
