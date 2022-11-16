import React from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { getContactRequestsAction } from '@Redux/contactRequests/contactRequestsSlice';
import { loginFailure } from '@Redux/profile/profileSlice';

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
            NotificationManager.success(
                'La demande de contact a bien été créée.',
                'Succès',
                Constant.REDIRECTION_TIME
            );

            dispatch(getContactRequestsAction());

            navigate(Constant.CONTACT_REQUEST_BASE_PATH);
        }
    };

    return <Component.ContactRequestsForm handleSubmit={handleSubmit} />;
};
