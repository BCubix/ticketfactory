import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, CardContent, Typography } from '@mui/material';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { TableColumn } from '@/AdminService/TableColumn';

import { changeSeasonsFilters, getSeasonsAction, seasonsSelector } from '@Redux/seasons/seasonsSlice';

import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const SeasonsList = () => {
    const { loading, seasons, filters, total, error } = useSelector(seasonsSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !seasons && !error) {
            dispatch(getSeasonsAction());
        }
    }, []);

    const handleDelete = async (id) => {
        await Api.seasonsApi.deleteSeason(id);

        dispatch(getSeasonsAction());

        setDeleteDialog(null);
    };

    const handleDuplicate = (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.seasonsApi.duplicateSeason(id);
            if (result?.result) {
                NotificationManager.success('La saison a bien été dupliquée.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getSeasonsAction());
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
    };

    return (
        <>
            <Component.CmtPageWrapper title={'Saisons'}>
                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <Component.CmtCardHeader
                        title={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography component="h2" variant="h5" sx={{ color: (theme) => theme.palette.primary.dark }}>
                                    Liste des saisons{' '}
                                    {seasons && `(${(filters.page - 1) * filters.limit + 1} - ${(filters.page - 1) * filters.limit + seasons.length} sur ${total})`}
                                </Typography>
                                <Component.CreateButton variant="contained" onClick={() => navigate(Constant.SEASONS_BASE_PATH + Constant.CREATE_PATH)}>
                                    Nouveau
                                </Component.CreateButton>
                            </Box>
                        }
                    />
                    <CardContent>
                        <Component.SeasonsFilters filters={filters} changeFilters={(values) => dispatch(changeSeasonsFilters(values))} />

                        <Component.ListTable
                            contextualMenu
                            table={TableColumn.SeasonsList}
                            list={seasons}
                            onEdit={(id) => {
                                navigate(`${Constant.SEASONS_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
                            }}
                            onDuplicate={(id) => {
                                handleDuplicate(id);
                            }}
                            onTranslate={(id, languageId) => {
                                navigate(`${Constant.SEASONS_BASE_PATH}${Constant.CREATE_PATH}?seasonId=${id}&languageId=${languageId}`);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                            filters={filters}
                            changeFilters={(newFilters) => dispatch(changeSeasonsFilters(newFilters))}
                        />

                        <Component.CmtPagination
                            page={filters.page}
                            total={total}
                            limit={filters.limit}
                            setPage={(newValue) => dispatch(changeSeasonsFilters({ ...filters }, newValue))}
                            setLimit={(newValue) => {
                                dispatch(changeSeasonsFilters({ ...filters, limit: newValue }));
                            }}
                            length={seasons?.length}
                        />
                    </CardContent>
                </Component.CmtCard>
            </Component.CmtPageWrapper>
            <Component.DeleteDialog open={deleteDialog ? true : false} onCancel={() => setDeleteDialog(null)} onDelete={() => handleDelete(deleteDialog)}>
                <Box textAlign="center" py={3}>
                    <Typography component="p">Êtes-vous sûr de vouloir supprimer cette salle ?</Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
        </>
    );
};
