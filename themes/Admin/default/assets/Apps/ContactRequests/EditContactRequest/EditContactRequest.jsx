import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getContactRequestsAction } from '@Apps/ContactRequests/redux/contactRequests/contactRequestsSlice';
import { loginFailure } from '@Apps/Auth/redux/profile/profileSlice';

export const EditContactRequest = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [contactRequest, setContactRequest] = useState(null);

    const getContactRequest = async (id) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.contactRequestsApi.getOneContactRequest(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);

            navigate(Constant.CONTACT_REQUEST_BASE_PATH);

            return;
        }

        setContactRequest(result.contactRequest);
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.CONTACT_REQUEST_BASE_PATH);
            return;
        }

        getContactRequest(id);
    }, [id]);

    const handleSubmit = async (values) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.contactRequestsApi.editContactRequest(id, values);

        if (result.result) {
            NotificationManager.success('La demande de contact a bien été modifiée.', 'Succès', Constant.REDIRECTION_TIME);

            dispatch(getContactRequestsAction());

            navigate(Constant.CONTACT_REQUEST_BASE_PATH);
        }
    };

    if (!contactRequest) {
        return <></>;
    }

    return <Component.ContactRequestsForm handleSubmit={handleSubmit} initialValues={contactRequest} />;
};
