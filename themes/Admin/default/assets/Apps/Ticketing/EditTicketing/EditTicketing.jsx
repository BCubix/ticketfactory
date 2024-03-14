import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { ticketingInitialSchema, ticketingValidationSchema, ticketingForm } from '@Apps/Ticketing/TicketingForm/TicketingForm';
import { getTicketingAction } from '@Apps/Ticketing/redux/ticketing/ticketingSlice';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const ticketingEditCrud = {
    form: {
        title: "Modification d'une billetterie",
        initialSchema: ticketingInitialSchema,
        validationSchema: ticketingValidationSchema,
    },
    ...ticketingForm,
};

export const EditTicketing = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [ticketing, setTicketing] = useState(null);

    const handleSubmit = async (values, apiSchema) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.ticketingApi.editTicketing(id, values, apiSchema);
            if (result.result) {
                NotificationManager.success('La billetterie a bien été modifié.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getTicketingAction());
                navigate(Constant.TICKETING_BASE_PATH);
            }
        });
    };

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            const ticketingResult = await Api.ticketingApi.getOneTicketing(id);
            if (!ticketingResult?.result) {
                NotificationManager.error('Une erreur est survenue.', 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.TICKETING_BASE_PATH);
                return;
            }

            setTicketing(ticketingResult?.ticketing);
            if (!ticketingResult?.ticketing?.module) {
                return;
            }
        });
    }, []);

    if (!ticketing) {
        return <></>;
    }

    return <Component.TicketingForm handleSubmit={handleSubmit} formCrud={Crud?.ticketing?.edit} initialValues={ticketing} module={ticketing?.module || null} />;
};
