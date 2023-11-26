import React from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { loginFailure } from '@Apps/Auth/redux/profile/profileSlice';
import { getRedirectionsAction } from '@Apps/Redirections/redux/redirections/redirectionsSlice';
import { redirectionsInitialSchema, redirectionsValidationSchema, redirectionsForm } from '../RedirectionsForm/RedirectionsForm';
import { Crud } from '@/AdminService/Crud';

export const redirectionsCreateCrud = {
    form: {
        title: "Création d'une redirection",
        initialSchema: redirectionsInitialSchema,
        validationSchema: redirectionsValidationSchema,
    },
    ...redirectionsForm,
};

export const CreateRedirection = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.redirectionsApi.createRedirection(values);

        if (result.result) {
            NotificationManager.success('La redirection a bien été créée.', 'Succès', Constant.REDIRECTION_TIME);

            dispatch(getRedirectionsAction());

            navigate(Constant.REDIRECTIONS_BASE_PATH);
        }
    };

    return <Component.CmtCrudForm handleSubmit={handleSubmit} formCrud={Crud?.redirections?.add} />;
};
