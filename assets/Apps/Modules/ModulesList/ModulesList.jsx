import React, { useEffect, useState } from 'react';
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from 'react-redux';

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

import { changeModulesFilters, getModulesAction, modulesSelector } from '@Redux/modules/modulesSlice';
import { loginFailure } from '@Redux/profile/profileSlice';

const ACTION_DISABLE = "Désactiver";
const ACTION_UNINSTALL = "Désinstaller";
const ACTION_UNINSTALL_DELETE = "Désinstaller & Supprimer";

export const ModulesList = () => {
    const { loading, modules, filters, total, error } = useSelector(modulesSelector);
    const dispatch = useDispatch();
    const [createDialog, setCreateDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(null);
    const [actionDelete, setActionDelete] = useState(ACTION_DISABLE);

    useEffect(() => {
        if (!loading && !modules && !error) {
            dispatch(getModulesAction());
        }
    }, []);

    const handleSubmit = () => {
        setCreateDialog(false);
        dispatch(getModulesAction());
        NotificationManager.success('Votre module a bien été ajouté.', 'Succès', Constant.REDIRECTION_TIME);
        setTimeout(() => window.location.reload(), 1000);
    }

    const handleActive = async (id) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));
            return;
        }

        const result = await Api.modulesApi.activeModule(id);

        if (result.result) {
            NotificationManager.success('Le module a bien été activé.', 'Succès', Constant.REDIRECTION_TIME);
        }

        dispatch(getModulesAction());
        setTimeout(() => window.location.reload(), 1000);
    }

    const handleDisable = async (id, action) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));
            return;
        }

        const result = await Api.modulesApi.disableModule(
            id,
            action === ACTION_UNINSTALL || action === ACTION_UNINSTALL_DELETE,
            action === ACTION_UNINSTALL_DELETE
        );

        if (result.result) {
            const message = result.module
                ? 'Le module a bien été désactivé.'
                : action === ACTION_UNINSTALL ? 'Le module a bien été désinstallé.' : 'Le module a bien été désinstallé et supprimer.';

            NotificationManager.success(message, 'Succès', Constant.REDIRECTION_TIME);
        }

        setDeleteDialog(null);
        setActionDelete(ACTION_DISABLE);

        dispatch(getModulesAction());
        setTimeout(() => window.location.reload(), 1000);
    }

    return (
        <>
            <Component.CmtPageWrapper title={'Modules'}>
                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Liste des modules{' '}
                                {modules &&
                                    `(${(filters.page - 1) * filters.limit + 1} - ${
                                        (filters.page - 1) * filters.limit + modules.length
                                    } sur ${total})`}
                            </Typography>
                            <Component.CreateButton variant="contained" onClick={() => setCreateDialog(true)}>
                                Upload
                            </Component.CreateButton>
                        </Box>

                        <Component.ModulesFilters
                            filters={filters}
                            changeFilters={(values) => dispatch(changeModulesFilters(values))}
                        />

                        <Component.ListTable
                            contextualMenu
                            table={TableColumn.ModulesList}
                            list={modules}
                            onActive={(id) => handleActive(id, false)}
                            onDisable={(id) => setDeleteDialog(id)}
                            filters={filters}
                            changeFilters={(newFilters) => dispatch(changeModulesFilters(newFilters))}
                        />

                        <Component.CmtPagination
                            page={filters.page}
                            total={total}
                            limit={filters.limit}
                            setPage={(newValue) =>
                                dispatch(changeModulesFilters({ ...filters }, newValue))
                            }
                            setLimit={(newValue) => {
                                dispatch(changeModulesFilters({ ...filters, limit: newValue }));
                            }}
                            length={modules?.length}
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
                    <Component.UploadModule handleSubmit={handleSubmit} />
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
                                        "Désactivation des fonctionnalités apportées par le module." + " " +
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
                                        "Désactivation du module et suppression de son paramétrage ainsi que des données saisies." + " " +
                                        "Le module reste présent sur le serveur et pourra être réinstallé ultérieurement, mais il devra être configuré à nouveau."
                                    }
                                </Typography>
                                <FormControlLabel
                                    value={ACTION_UNINSTALL_DELETE}
                                    control={<Radio />}
                                    label={ACTION_UNINSTALL_DELETE}
                                />
                                <Typography variant="h5">
                                    {
                                        "Désinstallation du module et suppression de son dossier du serveur." + " " +
                                        "Pour utiliser le module ultérieurement, vous devrez le télécharger, l'installer et le configurer à nouveau."
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
