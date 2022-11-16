import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Box } from '@mui/system';
import { CardContent, Typography } from '@mui/material';

import { changePagesFilters } from '@Redux/pages/pagesSlice';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";
import { TableColumn } from "@/AdminService/TableColumn";

import { getPagesAction, pagesSelector } from '@Redux/pages/pagesSlice';
import { loginFailure } from '@Redux/profile/profileSlice';

import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const PagesList = () => {
    const { loading, pages, filters, total, error } = useSelector(pagesSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !pages && !error) {
            dispatch(getPagesAction());
        }
    }, []);

    const handleDelete = async (id) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        await Api.pagesApi.deletePage(id);

        dispatch(getPagesAction());

        setDeleteDialog(null);
    };

    const handleDuplicate = (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.pagesApi.duplicatePage(id);

            if (result?.result) {
                NotificationManager.success(
                    'La page a bien été dupliquée.',
                    'Succès',
                    Constant.REDIRECTION_TIME
                );

                dispatch(getPagesAction());
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
    };

    return (
        <>
            <Component.CmtPageWrapper title={'Pages'}>
                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Liste des pages{' '}
                                {pages &&
                                    `(${(filters.page - 1) * filters.limit + 1} - ${
                                        (filters.page - 1) * filters.limit + pages.length
                                    } sur ${total})`}
                            </Typography>
                            <Component.CreateButton
                                variant="contained"
                                onClick={() => navigate(Constant.PAGES_BASE_PATH + Constant.CREATE_PATH)}
                            >
                                Nouveau
                            </Component.CreateButton>
                        </Box>

                        <Component.PagesFilters
                            filters={filters}
                            changeFilters={(values) => dispatch(changePagesFilters(values))}
                        />

                        <Component.ListTable
                            contextualMenu
                            table={TableColumn.PagesList}
                            list={pages}
                            onEdit={(id) => {
                                navigate(`${Constant.PAGES_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
                            }}
                            onDuplicate={(id) => {
                                handleDuplicate(id);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                            filters={filters}
                            changeFilters={(newFilters) => dispatch(changePagesFilters(newFilters))}
                        />

                        <Component.CmtPagination
                            page={filters.page}
                            total={total}
                            limit={filters.limit}
                            setPage={(newValue) =>
                                dispatch(changePagesFilters({ ...filters }, newValue))
                            }
                            setLimit={(newValue) => {
                                dispatch(changePagesFilters({ ...filters, limit: newValue }));
                            }}
                            length={pages?.length}
                        />
                    </CardContent>
                </Component.CmtCard>
            </Component.CmtPageWrapper>
            <Component.DeleteDialog
                open={deleteDialog ? true : false}
                onCancel={() => setDeleteDialog(null)}
                onDelete={() => handleDelete(deleteDialog)}
            >
                <Box textAlign="center" py={3}>
                    <Typography>Êtes-vous sûr de vouloir supprimer cette page ?</Typography>

                    <Typography>Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
        </>
    );
}
