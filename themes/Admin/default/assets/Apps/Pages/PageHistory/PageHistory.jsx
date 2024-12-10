import { Box } from '@mui/system';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Constant } from '@/AdminService/Constant';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Component } from '@/AdminService/Component';
import { CardContent, Container, Grid, Slider, Typography } from '@mui/material';
import moment from 'moment';
import { NotificationManager } from 'react-notifications';

import HistoryList from './HistoryList';
import VersionDiffViewer from './VersionDiffViewer';

export const PageHistory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const [pageHistory, setPageHistory] = useState(null);
    const [selectedVersion, setSelectedVersion] = useState(null);
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

    console.log(pageHistory);
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Historique des versions
            </Typography>
            <Grid container spacing={2}>
                {/* Liste des versions */}
                <Grid item xs={4}>
                    <HistoryList versions={pageHistory} onSelectVersion={setSelectedVersion} />
                </Grid>

                {/* Vue des différences */}
                <Grid item xs={8}>
                    {selectedVersion ? (
                        <>
                            <VersionDiffViewer version={selectedVersion} />
                        </>
                    ) : (
                        <Typography variant="body1">Sélectionnez une version pour voir les détails.</Typography>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

const DisplayHistoryValue = ({ isModified, oldValue, newValue }) => {
    return (
        <>
            <Grid item xs={12} sm={6}>
                <Box sx={{ borderRadius: 1, paddingBlock: 1, paddingInline: 3, ...(isModified && oldValue && { backgroundColor: (theme) => theme.palette.error.light }) }}>
                    <Typography>{oldValue}</Typography>
                </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Box sx={{ borderRadius: 1, paddingBlock: 1, paddingInline: 3, ...(isModified && newValue && { backgroundColor: (theme) => theme.palette.success.light }) }}>
                    <Typography>{newValue}</Typography>
                </Box>
            </Grid>
        </>
    );
};
