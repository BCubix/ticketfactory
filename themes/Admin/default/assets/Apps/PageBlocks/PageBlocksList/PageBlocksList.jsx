import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, CardContent, Typography } from '@mui/material';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { TableColumn } from '@/AdminService/TableColumn';

import { loginFailure } from '@Redux/profile/profileSlice';
import { changePageBlocksFilters, getPageBlocksAction, pageBlocksSelector } from '@Redux/pageBlocks/pageBlocksSlice';

import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const PageBlocksList = () => {
    const { loading, pageBlocks, filters, total, error } = useSelector(pageBlocksSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !pageBlocks && !error) {
            dispatch(getPageBlocksAction());
        }
    }, []);

    const handleDelete = async (id) => {
        apiMiddleware(dispatch, async () => {
            await Api.pageBlocksApi.deletePageBlock(id);
            dispatch(getPageBlocksAction());
            setDeleteDialog(null);
        });
    };

    const handleDuplicate = (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.pageBlocksApi.duplicatePageBlock(id);
            if (result?.result) {
                NotificationManager.success('Le bloc a bien été dupliquée.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getPageBlocksAction());
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
    };

    return (
        <>
            <Component.CmtPageWrapper title="Blocs">
                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5">
                                Liste des blocs{' '}
                                {pageBlocks && `(${(filters.page - 1) * filters.limit + 1} - ${(filters.page - 1) * filters.limit + pageBlocks.length} sur ${total})`}
                            </Typography>
                            <Component.CreateButton variant="contained" onClick={() => navigate(Constant.PAGE_BLOCKS_BASE_PATH + Constant.CREATE_PATH)}>
                                Nouveau
                            </Component.CreateButton>
                        </Box>

                        <Component.PageBlocksFilters filters={filters} changeFilters={(values) => dispatch(changePageBlocksFilters(values))} />

                        <Component.ListTable
                            contextualMenu
                            table={TableColumn.PageBlocksList}
                            list={pageBlocks}
                            onDuplicate={(id) => {
                                handleDuplicate(id);
                            }}
                            onEdit={(id) => {
                                navigate(`${Constant.PAGE_BLOCKS_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
                            }}
                            onTranslate={(id, languageId) => {
                                navigate(`${Constant.PAGE_BLOCKS_BASE_PATH}${Constant.CREATE_PATH}?pageBlockId=${id}&languageId=${languageId}`);
                            }}
                            filters={filters}
                            changeFilters={(newFilters) => dispatch(changePageBlocksFilters(newFilters))}
                            onDelete={(id) => setDeleteDialog(id)}
                        />

                        <Component.CmtPagination
                            page={filters.page}
                            total={total}
                            limit={filters.limit}
                            setPage={(newValue) => dispatch(changePageBlocksFilters({ ...filters }, newValue))}
                            setLimit={(newValue) => {
                                dispatch(changePageBlocksFilters({ ...filters, limit: newValue }));
                            }}
                            length={pageBlocks?.length}
                        />
                    </CardContent>
                </Component.CmtCard>
            </Component.CmtPageWrapper>
            <Component.DeleteDialog open={deleteDialog ? true : false} onCancel={() => setDeleteDialog(null)} onDelete={() => handleDelete(deleteDialog)}>
                <Box textAlign="center" py={3}>
                    <Typography component="p">Êtes-vous sûr de vouloir supprimer ce bloc ?</Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
        </>
    );
};
