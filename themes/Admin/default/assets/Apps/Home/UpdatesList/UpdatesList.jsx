import React, { useState, useMemo } from 'react';

import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import WarningIcon from '@mui/icons-material/Warning';

import { Button, Box, FormControlLabel, Switch, CardContent,  Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';


export const UpdatesList = ({parameters, modules, addonVersions}) => {
    const statusTheme = useTheme().palette.status;
    const navigate = useNavigate();

    const [updateCoreDialog, setUpdateCoreDialog] = useState({ open: false, backupDatabase: false });

    const isCoreUpdatable = useMemo(() => {
        if (!parameters || !addonVersions || addonVersions?.length === 0) {
            return false;
        }

        let versionParameter = parameters?.find((el) => el.paramKey === 'core_ticket_factory_version');
        if (versionParameter && addonVersions['TicketFactory']?.version > versionParameter?.paramValue) {
            return true;
        }

        return false;
    }, [parameters, addonVersions]);

    const isModuleUpdatable = useMemo(() => {
        return (currentModule) => {
            const versionModule = modules?.find((el) => el.name === currentModule);
            
            if (versionModule && addonVersions[currentModule]?.version > versionModule?.version) {
                return true;
            }

            return false;
        };
    }, [modules, addonVersions]);

    const handleUpdateCore = async (backupDatabase) => {
        const result = await Api.addonVersionsApi.updateCore(backupDatabase);
        if (result?.result) {
            NotificationManager.success('Ticket Factory a bien été mis à jour', 'Succès', Constant.REDIRECTION_TIME);
            setTimeout(() => window.location.reload(), 1000);
        }
    };
    
    const updatableModulesCount = useMemo(() => {
        if (!addonVersions || !modules) {
            return 0;
        }
        return Object.keys(addonVersions).filter((key) => isModuleUpdatable(key)).length;
    }, [addonVersions, modules, isModuleUpdatable]);

    if (!isCoreUpdatable && updatableModulesCount === 0)
    {
        return (<></>);
    }
    return (
        <>
                <Component.CmtCard>
                    <CardContent>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: statusTheme.warning.textColor,
                                        backgroundColor: statusTheme.warning.backgroundColor,
                                        padding: '10px',
                                        borderRadius: '4px',
                                    }}
                                >
                                    <WarningIcon style={{ marginRight: '10px' }} />
                                    <Typography variant="body1">Mise à jour disponible</Typography>
                                </Box>
                            </Grid>
                            <Grid item>
                                {isCoreUpdatable && (
                                    <>
                                        <Typography variant="body2">Ticket Factory:</Typography>
                                        <Button
                                            variant="contained"
                                            onClick={() => {
                                                setUpdateCoreDialog({ open: true, backupDatabase: false });
                                            }}
                                        >
                                            {addonVersions['TicketFactory']?.version}
                                        </Button>
                                    </>
                                )}
                            </Grid>
                            <Grid item>
                                {updatableModulesCount > 0 && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                        <Typography variant="body2">{updatableModulesCount} modules à mettre à jour:</Typography>
                                        <Button
                                            variant="contained"
                                            onClick={() => {
                                                navigate(Constant.MODULES_BASE_PATH);
                                            }}
                                            sx={{ marginLeft: '5px' }}
                                        >
                                            Mettre à jour
                                        </Button>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </CardContent>
                </Component.CmtCard>
            <Dialog
                fullWidth
                open={updateCoreDialog?.open}
                onClose={() => setUpdateCoreDialog({ open: false, backupDatabase: false })}
                sx={{ display: 'flex', justifyContent: 'center' }}
            >
                <DialogTitle sx={{ fontSize: 17 }}>Mettre à jour Ticket Factory</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={updateCoreDialog?.backupDatabase}
                                    onChange={(e) => {
                                        setUpdateCoreDialog({ ...updateCoreDialog, backupDatabase: e.target.checked });
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
                        <Button color="error" onClick={() => setUpdateCoreDialog({ open: false, backupDatabase: false })} id="cancelUpdateCoreDialog">
                            Annuler
                        </Button>
                        <Button
                            color="primary"
                            type="submit"
                            id="submitUpdateCoreDialog"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateCore(updateCoreDialog?.backupDatabase);
                            }}
                        >
                            Mettre à jour
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UpdatesList;