import React from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { getImageFormatsAction } from '@Redux/imageFormats/imageFormatSlice';
import { loginFailure } from '@Redux/profile/profileSlice';

export const CreateImageFormat = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.imageFormatsApi.createImageFormat(values);

        if (result.result) {
            NotificationManager.success('Le format a bien été créé.', 'Succès', Constant.REDIRECTION_TIME);

            dispatch(getImageFormatsAction());

            navigate(Constant.IMAGE_FORMATS_BASE_PATH);
        }
    };

    return <Component.ImageFormatForm handleSubmit={handleSubmit} />;
};
