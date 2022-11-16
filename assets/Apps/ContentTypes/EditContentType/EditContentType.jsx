import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { getContentTypesAction } from '@Redux/contentTypes/contentTypesSlice';
import { loginFailure } from '@Redux/profile/profileSlice';

export const EditContentType = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [contentType, setContentType] = useState(null);

    const getContentType = async (id) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.contentTypesApi.getOneContentType(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);

            navigate(Constant.CONTENT_TYPES_BASE_PATH);

            return;
        }

        setContentType(result.contentType);
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.CONTENT_TYPES_BASE_PATH);
            return;
        }

        getContentType(id);
    }, [id]);

    const handleSubmit = async (values) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.contentTypesApi.editContentType(id, values);

        if (result.result) {
            NotificationManager.success(
                'Le type de contenus a bien été modifié.',
                'Succès',
                Constant.REDIRECTION_TIME
            );

            dispatch(getContentTypesAction());

            navigate(Constant.CONTENT_TYPES_BASE_PATH);
        }
    };

    if (!contentType) {
        return <></>;
    }

    return <Component.ContentTypesForm submitForm={handleSubmit} initialValues={contentType} />;
};
