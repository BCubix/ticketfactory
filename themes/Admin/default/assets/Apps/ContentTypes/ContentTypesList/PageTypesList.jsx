import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { CardContent, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { TableColumn } from '@/AdminService/TableColumn';

import { changePageTypesFilters, pageTypesSelector, getPageTypesAction } from '@Redux/pageTypes/pageTypesSlice';
import { loginFailure } from '@Redux/profile/profileSlice';

export const PageTypesList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, pageTypes, filters, total, error } = useSelector(pageTypesSelector);
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !pageTypes && !error) {
            dispatch(getPageTypesAction());
        }
    }, []);

    const handleDelete = async (id) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        await Api.contentTypesApi.deleteContentType(id);
        dispatch(getPageTypesAction());
        setDeleteDialog(null);
    };

    return (
        <>
            <Component.CmtPageWrapper title="Types de pages">
                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <Component.CmtCardHeader
                        title={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography component="h2" variant="h5" sx={{ color: (theme) => theme.palette.primary.dark }}>
                                    Liste des types de pages{' '}
                                    {pageTypes && `(${(filters.page - 1) * filters.limit + 1} - ${(filters.page - 1) * filters.limit + pageTypes.length} sur ${total})`}
                                </Typography>
                                <Component.CreateButton variant="contained" onClick={() => navigate(Constant.PAGE_TYPES_BASE_PATH + Constant.CREATE_PATH)}>
                                    Nouveau
                                </Component.CreateButton>
                            </Box>
                        }
                    />
                    <CardContent>
                        <Component.ContentTypesFilters filters={filters} changeFilters={(values) => dispatch(changePageTypesFilters(values))} />

                        <Component.ListTable
                            filters={filters}
                            table={TableColumn.ContentTypesList}
                            list={pageTypes}
                            onEdit={(id) => {
                                navigate(`${Constant.PAGE_TYPES_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
                            }}
                            changeFilters={(newFilters) => dispatch(changePageTypesFilters(newFilters))}
                            onDelete={(id) => setDeleteDialog(id)}
                        />

                        <Component.CmtPagination
                            page={filters.page}
                            total={total}
                            limit={filters.limit}
                            setPage={(newValue) => dispatch(changePageTypesFilters({ ...filters }, newValue))}
                            setLimit={(newValue) => {
                                dispatch(changePageTypesFilters({ ...filters, limit: newValue }));
                            }}
                            length={pageTypes?.length}
                        />
                    </CardContent>
                </Component.CmtCard>
            </Component.CmtPageWrapper>
            <Component.DeleteDialog open={deleteDialog ? true : false} onCancel={() => setDeleteDialog(null)} onDelete={() => handleDelete(deleteDialog)}>
                <Box textAlign="center" py={3}>
                    <Typography component="p">Êtes-vous sûr de vouloir supprimer ce type de contenus ?</Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
        </>
    );
};
