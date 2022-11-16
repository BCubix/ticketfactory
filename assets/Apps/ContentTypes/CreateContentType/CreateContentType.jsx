import React from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { getContentTypesAction } from '@Redux/contentTypes/contentTypesSlice';
import { loginFailure } from '@Redux/profile/profileSlice';

export const CreateContentType = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.contentTypesApi.createContentType(values);

        if (result.result) {
            NotificationManager.success(
                'Le type de contenu a bien été créé.',
                'Succès',
                Constant.REDIRECTION_TIME
            );

            dispatch(getContentTypesAction());

            navigate(Constant.CONTENT_TYPES_BASE_PATH);
        }
    };

    return <Component.ContentTypesForm submitForm={handleSubmit} />;
};
