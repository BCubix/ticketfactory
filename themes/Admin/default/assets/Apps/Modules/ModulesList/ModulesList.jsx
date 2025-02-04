import React, { useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { Box } from '@mui/system';
import {
    Button,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Switch,
    Typography,
} from '@mui/material';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { TableColumn } from '@/AdminService/TableColumn';

import { getModulesAction, modulesSelector } from '@Apps/Modules/redux/modules/modulesSlice';
import { getAddonVersionsAction, addonVersionsSelector } from '@Apps/AddonVersions/redux/addonVersions/addonVersionsSlice';
import { loginFailure, userProfileSelector } from '@Apps/Auth/redux/userProfile/userProfileSlice';
import { getUserRoles } from '@Services/utils/getUserRoles';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

const ACTION_DISABLE = 'Désactiver';
const ACTION_UNINSTALL = 'Désinstaller';
const ACTION_UNINSTALL_DELETE = 'Désinstaller & Supprimer';

export const ModulesList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, modules, error } = useSelector(modulesSelector);
    const { addonVersionsLoading, addonVersions, addonVersionsError } = useSelector(addonVersionsSelector);
    const { user } = useSelector(userProfileSelector);
    const [isMarketplaceConnected, setMarketplaceConnected] = useState(false);
    const [marketplaceDialog, setMarketplaceDialog] = useState(false);
    const [updateModuleDialog, setUpdateModuleDialog] = useState({ open: false, addon: null, backupDatabase: false });
    const [createDialog, setCreateDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(null);
    const [removeDialog, setRemoveDialog] = useState(null);
    const [actionDelete, setActionDelete] = useState(ACTION_DISABLE);
    const [loadingDialog, setLoadingDialog] = useState(null);

    const userRoles = useMemo(() => {
        return getUserRoles(user);
    }, [user]);

    const [accessUserCreate, accessUserEdit, accessUserDelete, accessUserParameterEdit] = useMemo(() => {
        return [
            checkUserAccess(userRoles, 'ROLE_MODULE_CREATE'),
            checkUserAccess(userRoles, 'ROLE_MODULE_EDIT'),
            checkUserAccess(userRoles, 'ROLE_MODULE_DELETE'),
            checkUserAccess(userRoles, 'ROLE_PARAMETER_EDIT'),
        ];
    }, [userRoles]);

    useEffect(() => {
        if (!loading && !modules && !error) {
            dispatch(getModulesAction());
        }

        checkMarketplaceConnection();

        if (!addonVersionsLoading && !addonVersions && !addonVersionsError) {
            dispatch(getAddonVersionsAction());
        }
    }, []);

    const updateList = useMemo(() => {
        if (!addonVersions || addonVersions?.length === 0 || !modules || modules.length === 0) {
            return {};
        }

        let result = {};
        modules.forEach((e) => {
            result[e.name] = addonVersions[e.name]?.version > e.version;
        });

        return result;
    }, [modules, addonVersions]);

    const handleSubmit = () => {
        setLoadingDialog(null);
        dispatch(getModulesAction());
        NotificationManager.success('Votre module a bien été ajouté.', 'Succès', Constant.REDIRECTION_TIME);
        setTimeout(() => window.location.reload(), 1000);
    };

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
        setTimeout(() => window.location.reload(), 1000);
    };

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

        const result = await Api.modulesApi.disableModule(name, action === ACTION_DISABLE ? 0 : action === ACTION_UNINSTALL ? 1 : 2);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            navigate(Constant.MODULES_BASE_PATH);

            return;
        }

        setLoadingDialog(null);

        const message = result.module
            ? 'Le module a bien été désactivé.'
            : action === ACTION_UNINSTALL
            ? 'Le module a bien été désinstallé.'
            : 'Le module a bien été désinstallé et supprimer.';

        NotificationManager.success(message, 'Succès', Constant.REDIRECTION_TIME);

        setActionDelete(ACTION_DISABLE);
        setTimeout(() => window.location.reload(), 1000);
    };

    const checkMarketplaceConnection = async () => {
        const result = await Api.marketplaceApi.checkIsAuth();
        if (result?.result) {
            setMarketplaceDialog(false);
            setMarketplaceConnected(true);
        }
    };

    const handleUpdateModule = async (item, backupDatabase) => {
        const result = await Api.addonVersionsApi.updateModule(item.name, backupDatabase);
        if (result?.result) {
            NotificationManager.success('Le module à bien été mis à jour', 'Succès', Constant.REDIRECTION_TIME);
            setTimeout(() => window.location.reload(), 1000);
        }
    };

    const handleUpdateAllModules = async (backupDatabase) => {
        const result = await Api.addonVersionsApi.updateAllModules(backupDatabase);
        if (result?.result) {
            NotificationManager.success('Tous les modules ont bien été mis à jour', 'Succès', Constant.REDIRECTION_TIME);
            setTimeout(() => window.location.reload(), 1000);
        }
    };

    return (
        <>
            <Component.CmtPageWrapper
                title={'Modules'}
                actionButton={
                    accessUserEdit && !isMarketplaceConnected ? (
                        <Component.ActionButton variant="contained" onClick={() => setMarketplaceDialog(true)}>
                            Connexion à la marketplace
                        </Component.ActionButton>
                    ) : null
                }
            >
                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <Component.CmtCardHeader
                        title={
                            <Box className="list-header">
                                <Typography component="h2" variant="h5" sx={{ color: (theme) => theme.palette.primary.dark }}>
                                    Liste des modules
                                </Typography>

                                <Box className="flex">
                                    {accessUserEdit && Object.values(updateList)?.some(Boolean) && (
                                        <Component.ActionButton
                                            variant="contained"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setUpdateModuleDialog({ open: true, addon: null, backupDatabase: false });
                                            }}
                                            sx={{ mr: 3 }}
                                        >
                                            Tout mettre à jour
                                        </Component.ActionButton>
                                    )}

                                    {accessUserCreate && (
                                        <Component.CreateButton variant="contained" onClick={() => setCreateDialog(true)}>
                                            Upload
                                        </Component.CreateButton>
                                    )}
                                </Box>
                            </Box>
                        }
                    />
                    <CardContent>
                    {loading? (<Component.CmtSkeletonList></Component.CmtSkeletonList>): 
                            (<Component.ListTable
                                table={TableColumn.ModulesList}
                                list={modules}
                                onActive={(name) => handleActive(name)}
                                onDisable={(name) => setDeleteDialog(name)}
                                onRemove={accessUserDelete ? (name) => setRemoveDialog(name) : null}
                                onParameter={(moduleItem) => navigate(`${Constant.PARAMETERS_BASE_PATH}/modules/${moduleItem.id}`)}
                                displayParameter={accessUserEdit && accessUserParameterEdit ? (moduleItem) => Boolean(moduleItem.id) : null}
                                additionnalOptions={[
                                    ({ item }) => {
                                        return accessUserEdit ? (
                                            <Component.ActionFabButton
                                                sx={{ marginInline: 1 }}
                                                color="primary"
                                                size="small"
                                                aria-label="Action"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    item.active ? setDeleteDialog(item.name) : handleActive(item.name);
                                                }}
                                            >
                                                {item.active ? <UnpublishedIcon /> : <CheckCircleIcon />}
                                            </Component.ActionFabButton>
                                        ) : null;
                                    },
                                    ({ item }) => {
                                        return accessUserEdit && accessUserParameterEdit && Boolean(item.id) ? (
                                            <Component.EditFabButton
                                                sx={{ marginInline: 1 }}
                                                size="small"
                                                aria-label="Selection"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`${Constant.PARAMETERS_BASE_PATH}/modules/${item.id}`);
                                                }}
                                            >
                                                <SettingsIcon />
                                            </Component.EditFabButton>
                                        ) : null;
                                    },
                                    ({ item }) => {
                                        return accessUserEdit && updateList[item.name] ? (
                                            <Component.ActionFabButton
                                                sx={{ marginInline: 1 }}
                                                color="primary"
                                                size="small"
                                                aria-label="Selection"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setUpdateModuleDialog({ open: true, addon: item, backupDatabase: false });
                                                }}
                                            >
                                                <SystemUpdateAltIcon />
                                            </Component.ActionFabButton>
                                        ) : null;
                                    },
                                ]}
                            />
    )
                        }
                    </CardContent>
                </Component.CmtCard>
            </Component.CmtPageWrapper>

            <Dialog fullWidth maxWidth="md" open={createDialog} onClose={() => setCreateDialog(false)}>
                <DialogTitle sx={{ fontSize: 20 }}>Ajouter un zip</DialogTitle>
                <DialogContent>
                    <Component.UploadModule
                        handleSubmit={handleSubmit}
                        handleAdded={() => {
                            setCreateDialog(false);
                            setLoadingDialog('Vérification et installation du fichier zip...\n' + 'Activation et installation du module...');
                        }}
                        handleFail={(error) => {
                            setLoadingDialog(null);
                            NotificationManager.error(error.messagezone, 'Erreur', Constant.REDIRECTION_TIME * 2);
                            navigate(Constant.MODULES_BASE_PATH);
                        }}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}>
                <DialogTitle sx={{ fontSize: 20 }}>
                    {accessUserEdit && 'Désactivation'}
                    {accessUserDelete && `, désinstallation et/ou suppression`}
                </DialogTitle>

                <DialogContent dividers>
                    <Box textAlign="left">
                        <FormControl>
                            <RadioGroup name="Action" value={actionDelete} onChange={(event) => setActionDelete(event.target.value)}>
                                <FormControlLabel value={ACTION_DISABLE} control={<Radio />} label={ACTION_DISABLE} />
                                <Typography variant="h5">
                                    {'Désactivation des fonctionnalités apportées par le module.' +
                                        ' ' +
                                        'Le paramétrage et les données saisies sont conservées pour une réactivation ultérieure.'}
                                </Typography>

                                {accessUserDelete && (
                                    <>
                                        <FormControlLabel value={ACTION_UNINSTALL} control={<Radio />} label={ACTION_UNINSTALL} />
                                        <Typography variant="h5">
                                            {'Désactivation du module et suppression de son paramétrage ainsi que des données saisies.' +
                                                ' ' +
                                                'Le module reste présent sur le serveur et pourra être réinstallé ultérieurement, mais il devra être configuré à nouveau.'}
                                        </Typography>

                                        <FormControlLabel value={ACTION_UNINSTALL_DELETE} control={<Radio />} label={ACTION_UNINSTALL_DELETE} />
                                        <Typography variant="h5">
                                            {'Désinstallation du module et suppression de son dossier du serveur.' +
                                                ' ' +
                                                "Pour utiliser le module ultérieurement, vous devrez le télécharger, l'installer et le configurer à nouveau."}
                                        </Typography>
                                    </>
                                )}
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
                        <Button color="error" onClick={() => setDeleteDialog(null)}>
                            Annuler
                        </Button>
                        <Button color="primary" onClick={() => handleDisable(deleteDialog, actionDelete)}>
                            {actionDelete}
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>

            <Component.DeleteDialog open={!!removeDialog} onCancel={() => setRemoveDialog(null)} onDelete={() => handleDisable(removeDialog, ACTION_UNINSTALL_DELETE)}>
                <Box textAlign="center" py={3}>
                    <Typography>Êtes-vous sûr de vouloir supprimer ce module ?</Typography>

                    <Typography>Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>

            <Dialog fullWidth open={loadingDialog !== null} sx={{ display: 'flex', justifyContent: 'center' }}>
                <DialogTitle sx={{ fontSize: 17 }}>{loadingDialog}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Box>
                </DialogContent>
            </Dialog>

            <Dialog
                fullWidth
                open={updateModuleDialog?.open}
                onClose={() => setUpdateModuleDialog({ open: false, addon: null, backupDatabase: false })}
                sx={{ display: 'flex', justifyContent: 'center' }}
            >
                <DialogTitle sx={{ fontSize: 17 }}>
                    Mettre à jour {updateModuleDialog?.addon !== null ? `le module ${updateModuleDialog?.addon?.displayName}` : 'tous les modules'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={updateModuleDialog?.backupDatabase}
                                    onChange={(e) => {
                                        setUpdateModuleDialog({ ...updateModuleDialog, backupDatabase: e.target.checked });
                                    }}
                                />
                            }
                            label={'Faire une sauvegarde de la base de donnée ?'}
                            labelPlacement={'start'}
                        />

                        <Typography sx={{ marginTop: 5 }}>
                            Attention, si vous ne faites pas de sauvegarde de la base de donnée, nous ne pourrons pas assurer un retour en arrière en cas d'échec de la mise à jour.
                        </Typography>
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Box className="flex row-between align-center fullwidth" sx={{ width: '100%' }}>
                        <Button color="error" onClick={() => setUpdateModuleDialog({ open: false, addon: null, backupDatabase: false })} id="cancelUpdateModuleDialog">
                            Annuler
                        </Button>
                        <Button
                            color="primary"
                            type="submit"
                            id="submitUpdateModuleDialog"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (updateModuleDialog?.addon) {
                                    handleUpdateModule(updateModuleDialog?.addon, updateModuleDialog?.backupDatabase);
                                } else {
                                    handleUpdateAllModules(updateModuleDialog?.backupDatabase);
                                }
                            }}
                        >
                            Mettre à jour
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>

            {!isMarketplaceConnected && (
                <Component.MarketplaceConnectionDialog
                    open={marketplaceDialog}
                    onCancel={() => setMarketplaceDialog(false)}
                    onConnected={() => {
                        setMarketplaceDialog(false);
                        setMarketplaceConnected(true);

                        dispatch(getAddonVersionsAction());
                    }}
                />
            )}
        </>
    );
};