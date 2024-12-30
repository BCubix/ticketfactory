import React, { useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { Box, Button, CardContent, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import { HISTORY_TYPE_FIELDS } from '../services/utils/getHistoryTypeDisplay';
import { eventMainHistoryPart } from './EventHistoryTabs/EventMainHistoryPart';

import { Api } from '@/AdminService/Api';
import { Constant } from '@/AdminService/Constant';
import { Component } from '@/AdminService/Component';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Crud } from '@/AdminService/Crud';

export const eventHistoryCrud = {
    historyTypes: HISTORY_TYPE_FIELDS,
    fields: [
        {
            type: 'tabs',
            keyId: 'events',
            label: 'Evènement',
            fields: eventMainHistoryPart.blocks,
        },
    ],
};

export const EventHistory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [eventHistory, setEventHistory] = useState(null);
    const [event, setEvent] = useState(null);
    const [selectedHistory, setSelectedHistory] = useState(null);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        if (!id) {
            navigate(Constant.EVENTS_BASE_PATH);
            return;
        }

        apiMiddleware(dispatch, async () => {
            const [eventResult, historyResult] = await Promise.all([Api.eventsApi.getOneEvent(id), Api.eventHistoryApi.getOneEventHistory(id)]);
            if (!eventResult.result || !historyResult.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.EVENTS_BASE_PATH);
                return;
            }

            setEvent(eventResult.event);
            setEventHistory(historyResult.eventHistory || []);
            setSelectedHistory(historyResult.eventHistory.length > 0 ? historyResult.eventHistory.length - 1 : null);
        });
    }, [id]);

    const previousVersion = useMemo(() => {
        return selectedHistory !== null && selectedHistory > 0 ? eventHistory?.at(selectedHistory - 1)?.fields : null;
    }, [selectedHistory]);

    const actualVersion = useMemo(() => {
        return selectedHistory !== null ? eventHistory?.at(selectedHistory)?.fields : null;
    }, [selectedHistory]);

    const nextVersion = useMemo(() => {
        return eventHistory?.length > selectedHistory + 1 ? eventHistory?.at(selectedHistory + 1)?.fields : event;
    }, [selectedHistory]);

    const restoreVersion = () => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.eventHistoryApi.restoreHistory(eventHistory?.at(selectedHistory)?.id);
            if (result?.result) {
                NotificationManager.success('La event à bien été restauré.', 'Succès', Constant.REDIRECTION_TIME);
                navigate(`${Constant.EVENTS_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
                return;
            }
        });
    };

    if (!eventHistory) {
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
        <Component.CmtPageWrapper title="Historique d'événement">
            <Component.CmtHistoryDate historyList={eventHistory} selectedHistory={selectedHistory} setSelectedHistory={setSelectedHistory} />

            {selectedHistory !== null && (
                <>
                    <Component.CmtTabs
                        containerStyle={{ mt: 3 }}
                        tabValue={tabValue}
                        setTabValue={setTabValue}
                        mountComponents
                        list={Crud.events.history.fields.map((elem) => ({
                            id: elem.keyId,
                            label: elem.label,
                            component: Component.DisplayEventHistoryBlock({ blocks: elem?.fields, previousVersion, actualVersion, nextVersion, event, selectedHistory }),
                        }))}
                    />

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
                </>
            )}
        </Component.CmtPageWrapper>
    );
};
