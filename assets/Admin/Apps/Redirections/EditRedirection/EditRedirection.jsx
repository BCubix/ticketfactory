import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { loginFailure } from '@Redux/profile/profileSlice';
import { getRedirectionsAction } from '@Redux/redirections/redirectionsSlice';

export const EditRedirection = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [redirection, setRedirection] = useState(null);

    const getRedirection = async (id) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.redirectionsApi.getOneRedirection(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);

            navigate(Constant.REDIRECTIONS_BASE_PATH);

            return;
        }

        setRedirection(result.redirection);
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.REDIRECTIONS_BASE_PATH);
            return;
        }

        getRedirection(id);
    }, [id]);

    const handleSubmit = async (values) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.redirectionsApi.editRedirection(id, values);

        if (result.result) {
            NotificationManager.success(
                'La redirection a bien été modifiée.',
                'Succès',
                Constant.REDIRECTION_TIME
            );

            dispatch(getRedirectionsAction());

            navigate(Constant.REDIRECTIONS_BASE_PATH);
        }
    };

    if (!redirection) {
        return <></>;
    }

    return <Component.RedirectionsForm handleSubmit={handleSubmit} initialValues={redirection} />;
};
