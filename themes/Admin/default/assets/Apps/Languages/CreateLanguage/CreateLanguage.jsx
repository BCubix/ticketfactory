import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';

import { apiMiddleware } from '@Services/utils/apiMiddleware';

import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { Api } from '@/AdminService/Api';

import { getLanguagesAction } from '@Apps/Languages/redux/languages/languagesSlice';
import { Crud } from '@/AdminService/Crud';
import { languagesInitialSchema, languagesValidationSchema, languagesForm } from '../LanguagesForm/LanguagesForm';

export const languagesCreateCrud = {
    form: {
        title: "Création d'une langue",
        initialSchema: languagesInitialSchema,
        validationSchema: languagesValidationSchema,
    },
    ...languagesForm,
};

export const CreateLanguage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.languagesApi.createLanguage(values);
            if (result.result) {
                NotificationManager.success('La langue a bien été créée.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getLanguagesAction());
                navigate(Constant.LANGUAGES_BASE_PATH);
            }
        });
    };

    return <Component.CmtCrudForm handleSubmit={handleSubmit} formCrud={Crud?.languages?.add} />;
};
