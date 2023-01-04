import { Box } from '@mui/system';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Constant } from '@/AdminService/Constant';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Component } from '@/AdminService/Component';
import { CardContent, Grid, Slider, Typography } from '@mui/material';
import moment from 'moment';
import { NotificationManager } from 'react-notifications';

export const PageHistory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const [pageHistory, setPageHistory] = useState(null);
    const [selectedHistory, setSelectedHistory] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!id) {
            navigate(Constant.PAGES_BASE_PATH);
            return;
        }

        apiMiddleware(dispatch, async () => {
            const result = await Api.pageHistoryApi.getOnePageHistory(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.PAGES_BASE_PATH);
                return;
            }

            setPageHistory(result.pageHistory || []);
            setSelectedHistory(result.pageHistory.length > 0 ? result.pageHistory.length - 1 : null);
        });
    }, [id]);

    const restoreHistory = () => {
        if (!pageHistory?.at(selectedHistory)?.id) {
            return;
        }

        let historyId = pageHistory?.at(selectedHistory)?.id;

        apiMiddleware(dispatch, async () => {
            setLoading(true);
            const result = await Api.pageHistoryApi.restoreHistory(historyId);
            if (!result?.result) {
                setLoading(false);
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                return;
            }

            navigate(`${Constant.PAGES_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
        });
    };

    if (!pageHistory) {
        return <></>;
    }

    if (null === selectedHistory) {
        return (
            <Box display="flex" justifyContent={'center'}>
                <Typography>Il n'y a aucun historique pour le moment.</Typography>
            </Box>
        );
    }

    const history = pageHistory?.at(selectedHistory);

    return (
        <Component.CmtPageWrapper title="Historique de page">
            <Component.CmtHistoryDate historyList={pageHistory} selectedHistory={selectedHistory} setSelectedHistory={setSelectedHistory} />

            <Component.CmtCard>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">{moment(history?.revisionDate).format('DD-MM-YYYY HH:mm')}</Typography>
                    <Component.ActionButton variant="contained" size="small" disabled={selectedHistory === pageHistory?.length || loading} onClick={restoreHistory}>
                        Restaurer cette version
                    </Component.ActionButton>
                </CardContent>
            </Component.CmtCard>

            <Component.CmtCard sx={{ marginTop: 5 }}>
                <CardContent>
                    {history?.fields?.title && (
                        <Box>
                            <Typography component="h2" variant="h4">
                                Titre
                            </Typography>
                            <Grid container spacing={4} sx={{ marginBottom: 5 }}>
                                <DisplayHistoryValue
                                    isModified={history?.fields?.title.before !== history?.fields?.title.after}
                                    oldValue={history?.fields?.title.before}
                                    newValue={history?.fields?.title.after}
                                />
                            </Grid>
                        </Box>
                    )}

                    {history?.fields?.active && (
                        <Box>
                            <Typography component="h2" variant="h4">
                                Page Activé ?
                            </Typography>
                            <Grid container spacing={4} sx={{ marginBottom: 5 }}>
                                <DisplayHistoryValue
                                    isModified={history?.fields?.active.before !== history?.fields?.active.after}
                                    oldValue={history?.fields?.active.before ? 'Activé' : 'Désactivé'}
                                    newValue={history?.fields?.active.after ? 'Activé' : 'Désactivé'}
                                />
                            </Grid>
                        </Box>
                    )}
                </CardContent>
            </Component.CmtCard>
        </Component.CmtPageWrapper>
    );
};

const DisplayHistoryValue = ({ isModified, oldValue, newValue }) => {
    return (
        <>
            <Grid item xs={12} sm={6}>
                <Box sx={{ borderRadius: 1, paddingBlock: 1, paddingInline: 3, ...(isModified && { backgroundColor: (theme) => theme.palette.error.light }) }}>
                    <Typography>{oldValue}</Typography>
                </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Box sx={{ borderRadius: 1, paddingBlock: 1, paddingInline: 3, ...(isModified && { backgroundColor: (theme) => theme.palette.success.light }) }}>
                    <Typography>{newValue}</Typography>
                </Box>
            </Grid>
        </>
    );
};
