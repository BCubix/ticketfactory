import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getLanguagesAction } from '@Redux/languages/languagesSlice';

import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const EditLanguage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [language, setLanguage] = useState(null);

    const getLanguage = async (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.languagesApi.getOneLanguage(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.LANGUAGES_BASE_PATH);
                return;
            }

            setLanguage(result.language);
        });
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.LANGUAGES_BASE_PATH);
            return;
        }

        getLanguage(id);
    }, [id]);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.languagesApi.editLanguage(id, values);
            if (result.result) {
                NotificationManager.success('La langue a bien été modifié.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getLanguagesAction());
                navigate(Constant.LANGUAGES_BASE_PATH);
            }
        });
    };

    if (!language) {
        return <></>;
    }

    return <Component.LanguagesForm handleSubmit={handleSubmit} initialValues={language} />;
};
