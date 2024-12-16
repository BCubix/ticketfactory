import { Box } from '@mui/system';
import React, { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Constant } from '@/AdminService/Constant';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Component } from '@/AdminService/Component';
import { CardContent, Typography } from '@mui/material';
import { NotificationManager } from 'react-notifications';

import { DisplayPageDifferences } from './DisplayPageDifferences';

export const PageHistory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [pageHistory, setPageHistory] = useState(null);
    const [page, setPage] = useState(null);
    const [selectedHistory, setSelectedHistory] = useState(null);

    useEffect(() => {
        if (!id) {
            navigate(Constant.PAGES_BASE_PATH);
            return;
        }

        apiMiddleware(dispatch, async () => {
            const [pageResult, historyResult] = await Promise.all([Api.pagesApi.getOnePage(id), Api.pageHistoryApi.getOnePageHistory(id)]);
            if (!pageResult.result || !historyResult.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.PAGES_BASE_PATH);
                return;
            }

            setPage(pageResult.page);
            setPageHistory(historyResult.pageHistory || []);
            setSelectedHistory(historyResult.pageHistory.length > 0 ? historyResult.pageHistory.length - 1 : null);
        });
    }, [id]);

    const previousVersion = useMemo(() => {
        return selectedHistory !== null && selectedHistory > 0 ? pageHistory?.at(selectedHistory - 1)?.fields : null;
    }, [selectedHistory]);

    const actualVersion = useMemo(() => {
        return selectedHistory !== null ? pageHistory?.at(selectedHistory)?.fields : null;
    }, [selectedHistory]);

    const nextVersion = useMemo(() => {
        return pageHistory?.length > selectedHistory + 1 ? pageHistory?.at(selectedHistory + 1)?.fields : page;
    }, [selectedHistory]);

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

    console.log(pageHistory);

    return (
        <Component.CmtPageWrapper title="Historique de page">
            <Component.CmtHistoryDate historyList={pageHistory} selectedHistory={selectedHistory} setSelectedHistory={setSelectedHistory} />

            {selectedHistory !== null && (
                <Component.CmtCard sx={{ marginTop: 5 }}>
                    <CardContent>
                        <DisplayPageDifferences
                            previousVersion={previousVersion}
                            actualVersion={actualVersion}
                            nextVersion={nextVersion}
                            selectedHistory={selectedHistory}
                            pageHistory={pageHistory}
                            page={page}
                        />
                    </CardContent>
                </Component.CmtCard>
            )}
        </Component.CmtPageWrapper>
    );
};
