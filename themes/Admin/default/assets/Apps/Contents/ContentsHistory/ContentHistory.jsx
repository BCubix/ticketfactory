import { useDispatch } from 'react-redux';
import { HISTORY_TYPE_FIELDS } from '../services/config/getHistoryTypeDisplay';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';

import { Constant } from '@/AdminService/Constant';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Box, Button, CardContent } from '@mui/material';
import { DisplayContentDifferences } from './DisplayContentDifferences';
import { checkContentTypeChange } from '../services/config/checkTypes';

export const contentHistoryCrud = {
    historyTypes: HISTORY_TYPE_FIELDS,
};

export const ContentHistory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [contentHistory, setContentHistory] = useState(null);
    const [content, setContent] = useState(null);
    const [isRestorable, setIsRestorable] = useState(true);
    const [selectedHistory, setSelectedHistory] = useState(null);

    useEffect(() => {
        if (!id) {
            navigate(Constant.CONTENTS_BASE_PATH);
            return;
        }

        apiMiddleware(dispatch, async () => {
            const [contentResult, historyResult] = await Promise.all([Api.contentsApi.getOneContent(id), Api.contentHistoryApi.getOneContentHistory(id)]);
            if (!contentResult.result || !historyResult.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.CONTENTS_BASE_PATH);
                return;
            }

            setContent(contentResult.content);
            setContentHistory(historyResult.contentHistory || []);
            setSelectedHistory(historyResult.contentHistory.length > 0 ? historyResult.contentHistory.length - 1 : null);
        });
    }, [id]);

    const previousVersion = useMemo(() => {
        return selectedHistory !== null && selectedHistory > 0 ? contentHistory?.at(selectedHistory - 1)?.fields : null;
    }, [selectedHistory]);

    const actualVersion = useMemo(() => {
        return selectedHistory !== null ? contentHistory?.at(selectedHistory)?.fields : null;
    }, [selectedHistory]);

    const nextVersion = useMemo(() => {
        return contentHistory?.length > selectedHistory + 1 ? contentHistory?.at(selectedHistory + 1)?.fields : content;
    }, [selectedHistory]);

    const restoreVersion = () => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.contentHistoryApi.restoreHistory(contentHistory?.at(selectedHistory)?.id);
            if (result?.result) {
                NotificationManager.success('La content à bien été restauré.', 'Succès', Constant.REDIRECTION_TIME);
                navigate(`${Constant.CONTENTS_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
                return;
            }
        });
    };

    useEffect(() => {
        if (!contentHistory) {
            return;
        }

        if (checkContentTypeChange(contentHistory, selectedHistory)) {
            setIsRestorable(false);
            return;
        }

        setIsRestorable(true);
    }, [selectedHistory]);

    if (!contentHistory) {
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
        <Component.CmtPageWrapper title="Historique de contenu">
            <Component.CmtHistoryDate historyList={contentHistory} selectedHistory={selectedHistory} setSelectedHistory={setSelectedHistory} />

            {selectedHistory !== null && (
                <>
                    <Component.CmtCard sx={{ marginTop: 5 }}>
                        <CardContent>
                            <DisplayContentDifferences
                                previousVersion={previousVersion}
                                actualVersion={actualVersion}
                                nextVersion={nextVersion}
                                selectedHistory={selectedHistory}
                                contentHistory={contentHistory}
                                content={content}
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
