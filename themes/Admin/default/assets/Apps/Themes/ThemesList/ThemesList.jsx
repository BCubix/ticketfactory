import React, { useEffect, useState } from 'react';
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

import { Box } from '@mui/system';
import {
    CardContent,
    Dialog,
    DialogContent,
    DialogTitle,
    Typography
} from '@mui/material';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";
import { TableColumn } from "@/AdminService/TableColumn";

import { changeThemesFilters, getThemesAction, themesSelector } from '@Redux/themes/themesSlice';
import { apiMiddleware } from "@Services/utils/apiMiddleware";

export const ThemesList = () => {
    const { loading, themes, filters, total, error } = useSelector(themesSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [createDialog, setCreateDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(null);
    const [themeId, setThemeId] = useState(null);

    useEffect(() => {
        if (!loading && !themes && !error) {
            dispatch(getThemesAction());
        }

        apiMiddleware(dispatch, async () => {
            const result = await Api.parametersApi.getParametersByKey('main_theme');
            if (!result.result || !result.parameters) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.THEMES_BASE_PATH);

                return;
            }

            setThemeId(parseInt(result.parameters[0].paramValue));
        });
    }, []);

    const handleSubmit = () => {
        setCreateDialog(false);
        dispatch(getThemesAction());
        NotificationManager.success('Votre thème a bien été ajouté.', 'Succès', Constant.REDIRECTION_TIME);
        setTimeout(() => window.location.reload(), 1000);
    }

    const handleSelect = async (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.themesApi.chooseTheme(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.THEMES_BASE_PATH);

                return;
            }

            dispatch(getThemesAction());
            NotificationManager.success('Le thème choisi est devenue le thème principal.', 'Succès', Constant.REDIRECTION_TIME);
            setTimeout(() => window.location.reload(), 1000);
        });
    }

    const handleDelete = async (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.themesApi.deleteTheme(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.THEMES_BASE_PATH);

                return;
            }

            dispatch(getThemesAction());
            setDeleteDialog(null);
            setTimeout(() => window.location.reload(), 1000);
        });
    }

    return (
        <>
            <Component.CmtPageWrapper title={'Themes'}>
                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Liste des thèmes{' '}
                                {themes &&
                                    `(${(filters.page - 1) * filters.limit + 1} - ${
                                        (filters.page - 1) * filters.limit + themes.length
                                    } sur ${total})`}
                            </Typography>
                            <Component.CreateButton variant="contained" onClick={() => setCreateDialog(true)}>
                                Upload
                            </Component.CreateButton>
                        </Box>

                        <Component.ThemesFilters
                            filters={filters}
                            changeFilters={(values) => dispatch(changeThemesFilters(values))}
                        />

                        <Component.ListTable
                            table={TableColumn.ThemesList}
                            list={themes}
                            themeId={themeId}
                            onSelect={(id) => handleSelect(id)}
                            onDelete={(id) => setDeleteDialog(id)}
                            filters={filters}
                            changeFilters={(newFilters) => dispatch(changeThemesFilters(newFilters))}
                        />

                        <Component.CmtPagination
                            page={filters.page}
                            total={total}
                            limit={filters.limit}
                            setPage={(newValue) =>
                                dispatch(changeThemesFilters({ ...filters }, newValue))
                            }
                            setLimit={(newValue) => {
                                dispatch(changeThemesFilters({ ...filters, limit: newValue }));
                            }}
                            length={themes?.length}
                        />
                    </CardContent>
                </Component.CmtCard>
            </Component.CmtPageWrapper>
            <Dialog
                fullWidth
                maxWidth="md"
                open={createDialog}
                onClose={() => setCreateDialog(false)}
            >
                <DialogTitle sx={{ fontSize: 20 }}>Ajouter un zip</DialogTitle>
                <DialogContent>
                    <Component.UploadTheme handleSubmit={handleSubmit} />
                </DialogContent>
            </Dialog>
            <Component.DeleteDialog
                open={deleteDialog ? true : false}
                onCancel={() => setDeleteDialog(null)}
                onDelete={() => handleDelete(deleteDialog)}
            >
                <Box textAlign="center" py={3}>
                    <Typography>Êtes-vous sûr de vouloir supprimer ce thème ?</Typography>

                    <Typography>Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
        </>
    );
}
