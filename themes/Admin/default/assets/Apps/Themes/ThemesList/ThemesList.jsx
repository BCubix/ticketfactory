import React, { useEffect, useState } from 'react';
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

import { Box } from '@mui/system';
import {
    Button,
    CardContent,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography
} from '@mui/material';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";
import { TableColumn } from "@/AdminService/TableColumn";

import { changeThemesFilters, getThemesAction, themesSelector } from '@Redux/themes/themesSlice';
import { loginFailure } from '@Redux/profile/profileSlice';

const ACTION_DISABLE = "Désactiver";
const ACTION_UNINSTALL = "Désinstaller";
const ACTION_UNINSTALL_DELETE = "Désinstaller & Supprimer";

export const ThemesList = () => {
    const { loading, themes, filters, total, error } = useSelector(themesSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [createDialog, setCreateDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(null);
    const [actionDelete, setActionDelete] = useState(ACTION_DISABLE);

    useEffect(() => {
        if (!loading && !themes && !error) {
            dispatch(getThemesAction());
        }
    }, []);

    const handleSubmit = () => {
        setCreateDialog(false);
        dispatch(getThemesAction());
        NotificationManager.success('Votre thème a bien été ajouté.', 'Succès', Constant.REDIRECTION_TIME);
        setTimeout(() => window.location.reload(), 1000);
    }

    const handleActive = async (id) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));
            return;
        }

        const result = await Api.themesApi.activeTheme(id);
        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            navigate(Constant.THEMES_BASE_PATH);

            return;
        }

        NotificationManager.success('Le thème a bien été activé.', 'Succès', Constant.REDIRECTION_TIME);
        dispatch(getThemesAction());
        setTimeout(() => window.location.reload(), 1000);
    }

    const handleDisable = async (id, action) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));
            return;
        }

        const result = await Api.themesApi.disableTheme(
            id,
            action === ACTION_DISABLE ? 0 : action === ACTION_UNINSTALL ? 1 : 2
        );

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            navigate(Constant.THEMES_BASE_PATH);

            return;
        }

        const message = result.theme
            ? 'Le thème a bien été désactivé.'
            : action === ACTION_UNINSTALL ? 'Le thème a bien été désinstallé.' : 'Le thème a bien été désinstallé et supprimer.';

        NotificationManager.success(message, 'Succès', Constant.REDIRECTION_TIME);

        setDeleteDialog(null);
        setActionDelete(ACTION_DISABLE);

        dispatch(getThemesAction());
        setTimeout(() => window.location.reload(), 1000);
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
                            onActive={(id) => handleActive(id, false)}
                            onDisable={(id) => setDeleteDialog(id)}
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
            <Dialog
                open={!!deleteDialog}
                onClose={() => setDeleteDialog(null)}
            >
                <DialogTitle sx={{ fontSize: 20 }}>
                    Désactivation, désinstallation et/ou suppression
                </DialogTitle>
                <DialogContent dividers>
                    <Box textAlign="left">
                        <FormControl>
                            <RadioGroup
                                name="Action"
                                value={actionDelete}
                                onChange={(event) => setActionDelete(event.target.value)}
                            >
                                <FormControlLabel
                                    value={ACTION_DISABLE}
                                    control={<Radio />}
                                    label={ACTION_DISABLE}
                                />
                                <Typography variant="h5">
                                    {
                                        "Désactivation des fonctionnalités apportées par le thème." + " " +
                                        "Le paramétrage et les données saisies sont conservées pour une réactivation ultérieure."
                                    }
                                </Typography>
                                <FormControlLabel
                                    value={ACTION_UNINSTALL}
                                    control={<Radio />}
                                    label={ACTION_UNINSTALL}
                                />
                                <Typography variant="h5">
                                    {
                                        "Désactivation du thème et suppression de son paramétrage ainsi que des données saisies." + " " +
                                        "Le thème reste présent sur le serveur et pourra être réinstallé ultérieurement, mais il devra être configuré à nouveau."
                                    }
                                </Typography>
                                <FormControlLabel
                                    value={ACTION_UNINSTALL_DELETE}
                                    control={<Radio />}
                                    label={ACTION_UNINSTALL_DELETE}
                                />
                                <Typography variant="h5">
                                    {
                                        "Désinstallation du thème et suppression de son dossier du serveur." + " " +
                                        "Pour utiliser le thème ultérieurement, vous devrez le télécharger, l'installer et le configurer à nouveau."
                                    }
                                </Typography>
                            </RadioGroup>
                        </FormControl>

                    </Box>
                </DialogContent>

                <DialogActions>
                    <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
                        <Button color="primary" onClick={() => setDeleteDialog(null)}>
                            Annuler
                        </Button>
                        <Button color="error" onClick={() => handleDisable(deleteDialog, actionDelete)}>
                            { actionDelete }
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </>
    );
}
