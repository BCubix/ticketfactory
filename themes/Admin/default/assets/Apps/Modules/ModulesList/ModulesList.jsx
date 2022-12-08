import React, { useEffect, useState } from 'react';
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

import { Box } from '@mui/system';
import {
    Button,
    CardContent,
    CircularProgress,
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

import { getModulesAction, modulesSelector } from '@Redux/modules/modulesSlice';
import { loginFailure } from '@Redux/profile/profileSlice';

const ACTION_DISABLE = "Désactiver";
const ACTION_UNINSTALL = "Désinstaller";
const ACTION_UNINSTALL_DELETE = "Désinstaller & Supprimer";

export const ModulesList = () => {
    const { loading, modules, error } = useSelector(modulesSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [createDialog, setCreateDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(null);
    const [removeDialog, setRemoveDialog] = useState(null);
    const [actionDelete, setActionDelete] = useState(ACTION_DISABLE);
    const [loadingDialog, setLoadingDialog] = useState(null);

    useEffect(() => {
        if (!loading && !modules && !error) {
            dispatch(getModulesAction());
        }
    }, []);

    const handleSubmit = () => {
        setLoadingDialog(null);
        dispatch(getModulesAction());
        NotificationManager.success('Votre module a bien été ajouté.', 'Succès', Constant.REDIRECTION_TIME);
        setTimeout(() => window.location.reload(), 1000);
    }

    const handleActive = async (name) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));
            return;
        }

        setLoadingDialog(`Activation et installation du module : ${name}`);

        const result = await Api.modulesApi.activeModule(name);
        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            navigate(Constant.MODULES_BASE_PATH);

            return;
        }

        setLoadingDialog(null);

        NotificationManager.success('Le module a bien été activé.', 'Succès', Constant.REDIRECTION_TIME);
        dispatch(getModulesAction());
        setTimeout(() => window.location.reload(), 1000);
    }

    const handleDisable = async (name, action) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));
            return;
        }

        setDeleteDialog(null);

        if (action === ACTION_DISABLE) {
            setLoadingDialog(`Désactivation du module : ${name}`);
        } else if (action === ACTION_UNINSTALL) {
            setLoadingDialog(`Désinstallation du module : ${name}`);
        } else {
            setLoadingDialog(`Désinstallation et suppression du module : ${name}`);
        }

        const result = await Api.modulesApi.disableModule(
            name,
            action === ACTION_DISABLE ? 0 : action === ACTION_UNINSTALL ? 1 : 2
        );

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            navigate(Constant.MODULES_BASE_PATH);

            return;
        }

        setLoadingDialog(null);

        const message = result.module
            ? 'Le module a bien été désactivé.'
            : action === ACTION_UNINSTALL ? 'Le module a bien été désinstallé.' : 'Le module a bien été désinstallé et supprimer.';

        NotificationManager.success(message, 'Succès', Constant.REDIRECTION_TIME);

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
                                Liste des modules
                            </Typography>
                            <Component.CreateButton variant="contained" onClick={() => setCreateDialog(true)}>
                                Upload
                            </Component.CreateButton>
                        </Box>

                        <Component.ListTable
                            table={TableColumn.ModulesList}
                            list={modules}
                            onActive={(name) => handleActive(name)}
                            onDisable={(name) => setDeleteDialog(name)}
                            onRemove={(name) => setRemoveDialog(name)}
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
                    <Component.UploadModule
                        handleSubmit={handleSubmit}
                        handleAdded={() => {
                            setCreateDialog(false);
                            setLoadingDialog(
                                "Vérification et installation du fichier zip...\n" +
                                "Activation et installation du module...");
                        }}
                    />
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
            <Component.DeleteDialog
                open={!!removeDialog}
                onCancel={() => setRemoveDialog(null)}
                onDelete={() => handleDisable(removeDialog, ACTION_UNINSTALL_DELETE)}
            >
                <Box textAlign="center" py={3}>
                    <Typography>Êtes-vous sûr de vouloir supprimer ce module ?</Typography>

                    <Typography>Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
            <Dialog
                fullWidth
                open={loadingDialog !== null}
                sx={{ display: 'flex', justifyContent: 'center' }}
            >
                <DialogTitle sx={{ fontSize: 17 }}>{loadingDialog}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}
