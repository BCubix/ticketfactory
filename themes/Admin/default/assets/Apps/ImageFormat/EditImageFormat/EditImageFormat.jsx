import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { getImageFormatsAction } from '@Redux/imageFormats/imageFormatSlice';
import { loginFailure } from '@Redux/profile/profileSlice';

export const EditImageFormat = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [imageFormat, setImageFormat] = useState(null);

    const getImageFormat = async (id) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.imageFormatsApi.getOneImageFormat(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);

            navigate(Constant.IMAGE_FORMATS_BASE_PATH);

            return;
        }

        setImageFormat(result.imageFormat);
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.IMAGE_FORMATS_BASE_PATH);
            return;
        }

        getImageFormat(id);
    }, [id]);

    const handleSubmit = async (values) => {
        const result = await Api.imageFormatsApi.editImageFormat(id, values);

        if (result.result) {
            NotificationManager.success(
                'Le format a bien été modifié. Pensez à regénérer les miniatures ici-dessous !',
                'Succès',
                Constant.REDIRECTION_TIME
            );

            dispatch(getImageFormatsAction());

            navigate(Constant.IMAGE_FORMATS_BASE_PATH);
        }
    };

    if (!imageFormat) {
        return <></>;
    }

    return <Component.ImageFormatForm handleSubmit={handleSubmit} initialValues={imageFormat} />;
};
