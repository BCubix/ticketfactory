import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getEventTypesAction } from '@Apps/EventTypes/redux/eventTypes/eventTypesSlice';
import { eventTypesInitialSchema, eventTypesValidationSchema, eventTypesForm } from '../EventTypesForm/EventTypesForm';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Crud } from '@/AdminService/Crud';

export const eventTypesEditCrud = {
    form: {
        title: "Modification d'un type d'évènement",
        initialSchema: eventTypesInitialSchema,
        validationSchema: eventTypesValidationSchema,
    },
    ...eventTypesForm,
};

export const EditEventType = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [eventType, setEventType] = useState(null);

    const getEventType = async (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.eventTypesApi.getOneEventType(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.EVENT_TYPES_BASE_PATH);
                return;
            }

            setEventType(result.eventType);
        });
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.EVENT_TYPES_BASE_PATH);
            return;
        }

        getEventType(id);
    }, [id]);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.eventTypesApi.editEventType(id, values);
            if (result.result) {
                NotificationManager.success("Le type d'évènement a bien été modifié.", 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getEventTypesAction());
                navigate(Constant.EVENT_TYPES_BASE_PATH);
            }
        });
    };

    if (!eventType) {
        return <></>;
    }

    return <Component.CmtCrudForm handleSubmit={handleSubmit} initialValues={eventType} formCrud={Crud?.eventTypes?.edit} />;
};
