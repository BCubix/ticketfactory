import { Box } from '@mui/system';
import React, { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Constant } from '@/AdminService/Constant';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Component } from '@/AdminService/Component';
import { Button, CardContent, Typography } from '@mui/material';
import { NotificationManager } from 'react-notifications';

import { DisplayPageDifferences } from './DisplayPageDifferences';
import { HISTORY_TYPE_FIELDS } from '../services/utils/getHistoryTypeDisplay';
import { checkPageBlockTypeChange } from '../services/utils/checkTypes';

export const pageHistoryCrud = {
    historyTypes: HISTORY_TYPE_FIELDS,
};

export const PageHistory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [pageHistory, setPageHistory] = useState(null);
    const [page, setPage] = useState(null);
    const [isRestorable, setIsRestorable] = useState(true);
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

    const restoreVersion = () => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.pageHistoryApi.restoreHistory(pageHistory?.at(selectedHistory)?.id);
            console.log(result);
            if (result?.result) {
                NotificationManager.success('La page à bien été restauré.', 'Succès', Constant.REDIRECTION_TIME);
                navigate(`${Constant.PAGES_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
                return;
            }
        });
    };

    useEffect(() => {
        if (!pageHistory) {
            return;
        }

        if (checkPageBlockTypeChange(pageHistory, selectedHistory)) {
            setIsRestorable(false);
            return;
        }

        setIsRestorable(true);
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

    return (
        <Component.CmtPageWrapper title="Historique de page">
            <Component.CmtHistoryDate historyList={pageHistory} selectedHistory={selectedHistory} setSelectedHistory={setSelectedHistory} />

            {selectedHistory !== null && (
                <>
                    <Component.CmtCard sx={{ marginTop: 5 }}>
                        <CardContent>
                            <DisplayPageDifferences
                                previousVersion={previousVersion}
                                actualVersion={actualVersion}
                                nextVersion={nextVersion}
                                selectedHistory={selectedHistory}
                                pageHistory={pageHistory}
                                page={page}
                                isRestorable={isRestorable}
                                setIsRestorable={setIsRestorable}
                            />
                        </CardContent>
                    </Component.CmtCard>

                    {isRestorable && (
                        <Box className="flex row-end margin-top-5">
                            <Button
                                type="submit"
                                variant="contained"
                                id="restoreVersion"
                                onClick={(e) => {
                                    e.preventDefault();
                                    restoreVersion();
                                }}
                            >
                                Restaurer
                            </Button>
                        </Box>
                    )}
                </>
            )}
        </Component.CmtPageWrapper>
    );
};
