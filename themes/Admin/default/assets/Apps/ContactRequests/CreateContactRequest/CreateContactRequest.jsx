import React from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getContactRequestsAction } from '@Apps/ContactRequests/redux/contactRequests/contactRequestsSlice';
import { loginFailure } from '@Apps/Auth/redux/profile/profileSlice';

import { Crud } from '@/AdminService/Crud';
import { contactRequestsInitialSchema, contactRequestsValidationSchema, contactRequestsForm } from '@Apps/ContactRequests/ContactRequestsForm/ContactRequestsForm.jsx';

export const contactRequestsCreateCrud = {
    form: {
        title: "Creation d'une demande de contact",
        initialSchema: contactRequestsInitialSchema,
        validationSchema: contactRequestsValidationSchema,
    },
    ...contactRequestsForm,
};

export const CreateContactRequests = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.contactRequestsApi.createContactRequest(values);

        if (result.result) {
            NotificationManager.success('La demande de contact a bien été créée.', 'Succès', Constant.REDIRECTION_TIME);

            dispatch(getContactRequestsAction());

            navigate(Constant.CONTACT_REQUEST_BASE_PATH);
        }
    };

    return <Component.CmtCrudForm handleSubmit={handleSubmit} formCrud={Crud?.contactRequests?.add} />;
};
