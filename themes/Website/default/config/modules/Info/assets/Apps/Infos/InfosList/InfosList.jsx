import React, { useEffect, useState } from 'react';
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { CardContent, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";
import { TableColumn } from "@/AdminService/TableColumn";

import { loginFailure } from '@/redux/profile/profileSlice';
import { apiMiddleware } from "@/services/utils/apiMiddleware";

import { getInfosAction, infosSelector, changeInfosFilters } from "../../../redux/infos/infosSlice";

export const InfosList = () => {
    const { loading, infos, error, filters, total } = useSelector(infosSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !infos && !error) {
            dispatch(getInfosAction());
        }
    }, []);

    const handleDuplicate = (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.infosApi.duplicateInfo(id);

            if (result?.result) {
                NotificationManager.success(
                    'L\'information a bien été dupliquée.',
                    'Succès',
                    Constant.REDIRECTION_TIME
                );

                dispatch(getInfosAction());
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
    };

    const handleDelete = async (id) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        await Api.infosApi.deleteInfo(id);

        dispatch(getInfosAction());

        setDeleteDialog(null);
    };

    return (
        <>
            <Component.CmtPageWrapper title={'Informations'}>
                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Liste des informations{' '}
                                {infos &&
                                    `(${(filters.page - 1) * filters.limit + 1} - ${
                                        (filters.page - 1) * filters.limit + infos.length
                                    } sur ${total})`}
                            </Typography>
                            <Component.CreateButton
                                variant="contained"
                                onClick={() => navigate(Constant.INFOS_BASE_PATH + Constant.CREATE_PATH)}
                            >
                                Nouveau
                            </Component.CreateButton>
                        </Box>
                        <Component.InfosFilters
                            filters={filters}
                            changeFilters={(values) => dispatch(changeInfosFilters(values))}
                        />

                        <Component.ListTable
                            contextualMenu
                            table={TableColumn.InfosList}
                            list={infos}
                            onEdit={(id) => {
                                navigate(`${Constant.INFOS_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
                            }}
                            onDuplicate={(id) => {
                                handleDuplicate(id);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                            filters={filters}
                            changeFilters={(newFilters) =>
                                dispatch(changeInfosFilters(newFilters))
                            }
                        />

                        <Component.CmtPagination
                            page={filters.page}
                            total={total}
                            limit={filters.limit}
                            setPage={(newValue) =>
                                dispatch(changeInfosFilters({ ...filters }, newValue))
                            }
                            setLimit={(newValue) => {
                                dispatch(changeInfosFilters({ ...filters, limit: newValue }));
                            }}
                            length={infos?.length}
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
                    <Typography>Êtes-vous sûr de vouloir supprimer cette information ?</Typography>

                    <Typography>Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
        </>
    );
}

export default { InfosList };
