import React, { useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, Switch, Typography } from '@mui/material';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { dashboardSelector, getDashboardAction } from '@Apps/Home/redux/dashboard/dashboardSlice';
import { parametersSelector } from '@Apps/Parameters/redux/parameters/parametersSlice';
import { addonVersionsSelector, getAddonVersionsAction } from '@Apps/AddonVersions/redux/addonVersions/addonVersionsSlice';

import { UpdatesList } from './UpdatesList/UpdatesList';

export const MainDashboard = () => {
    const { loading, dashboard, error } = useSelector(dashboardSelector);
    const { addonVersionsLoading, addonVersions, addonVersionsError } = useSelector(addonVersionsSelector);
    const { parameters } = useSelector(parametersSelector);
    const [isMarketplaceConnected, setMarketplaceConnected] = useState(false);
    const [marketplaceDialog, setMarketplaceDialog] = useState(false);
    const [updateCoreDialog, setUpdateCoreDialog] = useState({ open: false, backupDatabase: false });
    const dispatch = useDispatch();

    useEffect(() => {
        checkMarketplaceConnection();

        if (!loading && !dashboard && !error) {
            dispatch(getDashboardAction());
        }

        if (!addonVersionsLoading && !addonVersions && !addonVersionsError) {
            dispatch(getAddonVersionsAction());
        }
    }, []);

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

    const handleUpdateCore = async (backupDatabase) => {
        const result = await Api.addonVersionsApi.updateCore(backupDatabase);
        if (result?.result) {
            NotificationManager.success('Ticket Factory à bien été mis à jour', 'Succès', Constant.REDIRECTION_TIME);
            setTimeout(() => window.location.reload(), 1000);
        }
    };

    const checkMarketplaceConnection = async () => {
        const result = await Api.marketplaceApi.checkIsAuth();
        if (result?.result) {
            setMarketplaceDialog(false);
            setMarketplaceConnected(true);
        }
    };

    return (
        <Component.CmtPageWrapper
            title={'Tableau de bord'}
            actionButton={
                !isMarketplaceConnected ? (
                    <Component.ActionButton variant="contained" onClick={() => setMarketplaceDialog(true)}>
                        Connexion à la marketplace
                    </Component.ActionButton>
                ) : null
            }
        >
            {dashboard && (
                <Grid container spacing={4} sx={{ marginTop: 0 }}>
                    <Grid item xs={12} md={4} lg={3}>
                        {isCoreUpdatable && (
                            <Component.CmtCard>
                                <Component.CmtCardHeader title="Mise à jour de Ticket Factory" />
                                <CardContent>
                                    <Typography>Une nouvelle version de Ticket Factory est disponible. Cliquez ci-dessous pour l'installer.</Typography>
                                    <Box display="flex" justifyContent={'center'} sx={{ paddingTop: 2, marginTop: 5 }}>
                                        <Button
                                            variant="contained"
                                            onClick={() => {
                                                setUpdateCoreDialog({ open: true, backupDatabase: false });
                                            }}
                                        >
                                            Mettre à jour
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Component.CmtCard>
                        )}
                        <Component.FirstCardDashboard data={dashboard.col1} />
                    </Grid>
                    <Grid item xs={12} md={8} lg={7}>
                        <Component.SecondCardDashboard data={dashboard.col2} />
                    </Grid>
                    <Grid item xs={12} md={2} lg={2}>
                        <Component.ThirdCardDashboard data={dashboard.col3} />
                    </Grid>
                </Grid>
            )}

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
        </Component.CmtPageWrapper>
    );
};
