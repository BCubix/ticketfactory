import React, { useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ticketingInitialSchema, ticketingValidationSchema, ticketingForm } from '@Apps/Ticketing/TicketingForm/TicketingForm';
import { getTicketingAction } from '@Apps/Ticketing/redux/ticketing/ticketingSlice';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const ticketingCreateCrud = {
    form: {
        title: "Creation d'une billetterie",
        initialSchema: ticketingInitialSchema,
        validationSchema: ticketingValidationSchema,
    },
    ...ticketingForm,
};

export const CreateTicketing = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.ticketingApi.createTicketing(values);
            if (result.result) {
                NotificationManager.success('La billetterie a bien été créée.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getTicketingAction());
                navigate(Constant.ROOMS_BASE_PATH);
            }
        });
    };

    return <Component.CmtCrudForm handleSubmit={handleSubmit} formCrud={Crud?.ticketing?.add} />;
};
