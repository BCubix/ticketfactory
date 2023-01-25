import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, CardContent, Typography } from '@mui/material';
import { redirectionsSelector } from '@Redux/redirections/redirectionsSlice';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { TableColumn } from '@/AdminService/TableColumn';

import { loginFailure } from '@Redux/profile/profileSlice';
import { changeRedirectionsFilters, getRedirectionsAction } from '@Redux/redirections/redirectionsSlice';

export const RedirectionsList = () => {
    const { loading, redirections, filters, total, error } = useSelector(redirectionsSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !redirections && !error) {
            dispatch(getRedirectionsAction());
        }
    }, []);

    const handleDelete = async (id) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        await Api.redirectionsApi.deleteRedirection(id);

        dispatch(getRedirectionsAction());

        setDeleteDialog(null);
    };

    return (
        <>
            <Component.CmtPageWrapper title="Redirections">
                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5">
                                Liste des redirections{' '}
                                {redirections && `(${(filters.page - 1) * filters.limit + 1} - ${(filters.page - 1) * filters.limit + redirections.length} sur ${total})`}
                            </Typography>
                            <Component.CreateButton variant="contained" onClick={() => navigate(Constant.REDIRECTIONS_BASE_PATH + Constant.CREATE_PATH)}>
                                Nouveau
                            </Component.CreateButton>
                        </Box>

                        <Component.RedirectionsFilters filters={filters} changeFilters={(values) => dispatch(changeRedirectionsFilters(values))} />

                        <Component.ListTable
                            table={TableColumn.RedirectionsList}
                            list={redirections}
                            onEdit={(id) => {
                                navigate(`${Constant.REDIRECTIONS_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                            filters={filters}
                            changeFilters={(newFilters) => dispatch(changeRedirectionsFilters(newFilters))}
                        />

                        <Component.CmtPagination
                            page={filters.page}
                            total={total}
                            limit={filters.limit}
                            setPage={(newValue) => dispatch(changeRedirectionsFilters({ ...filters }, newValue))}
                            setLimit={(newValue) => {
                                dispatch(changeRedirectionsFilters({ ...filters, limit: newValue }));
                            }}
                            length={redirections?.length}
                        />
                    </CardContent>
                </Component.CmtCard>
            </Component.CmtPageWrapper>
            <Component.DeleteDialog open={deleteDialog ? true : false} onCancel={() => setDeleteDialog(null)} onDelete={() => handleDelete(deleteDialog)}>
                <Box textAlign="center" py={3}>
                    <Typography component="p">Êtes-vous sûr de vouloir supprimer cette redirection ?</Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
        </>
    );
};
