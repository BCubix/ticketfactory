import React from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getImageFormatsAction } from '@Apps/ImageFormats/redux/imageFormats/imageFormatSlice';
import { loginFailure } from '@Apps/Auth/redux/userProfile/userProfileSlice';
import { Crud } from '@/AdminService/Crud';
import { imageFormatsInitialSchema, imageFormatsValidationSchema, imageFormatsForm } from '../ImageFormatsForm/ImageFormatsForm';

export const imageFormatsCreateCrud = {
    form: {
        title: "Creation d'un emplacement de média",
        initialSchema: imageFormatsInitialSchema,
        validationSchema: imageFormatsValidationSchema,
    },
    ...imageFormatsForm,
};

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
            NotificationManager.success("L'emplacement a bien été créé. Pensez à générer les miniatures ici-dessous !", 'Succès', Constant.REDIRECTION_TIME);
            dispatch(getImageFormatsAction());
            navigate(Constant.IMAGE_FORMATS_BASE_PATH);
        }
    };

    return <Component.CmtCrudForm handleSubmit={handleSubmit} formCrud={Crud?.imageFormats?.add} />;
};
