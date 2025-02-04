import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getImageFormatsAction } from '@Apps/ImageFormats/redux/imageFormats/imageFormatSlice';
import { loginFailure } from '@Apps/Auth/redux/userProfile/userProfileSlice';
import { Crud } from '@/AdminService/Crud';
import { imageFormatsInitialSchema, imageFormatsValidationSchema, imageFormatsForm } from '../ImageFormatsForm/ImageFormatsForm';

export const imageFormatsEditCrud = {
    form: {
        title: "Modification d'un emplacement de média",
        initialSchema: imageFormatsInitialSchema,
        validationSchema: imageFormatsValidationSchema,
    },
    ...imageFormatsForm,
};

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
            NotificationManager.success("L'emplacement a bien été modifié. Pensez à regénérer les miniatures ici-dessous !", 'Succès', Constant.REDIRECTION_TIME);

            dispatch(getImageFormatsAction());

            navigate(Constant.IMAGE_FORMATS_BASE_PATH);
        }
    };

    if (!imageFormat) {
        return <></>;
    }

    return <Component.CmtCrudForm handleSubmit={handleSubmit} initialValues={imageFormat} formCrud={Crud?.imageFormats?.edit} />;
};
