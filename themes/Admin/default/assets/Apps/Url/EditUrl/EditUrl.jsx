import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { getUrlAction } from '@Apps/Url/redux/url/urlSlice';
import { urlInitialSchema, urlValidationSchema, urlForm } from '@Apps/Url/UrlForm/UrlForm';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Crud } from '@/AdminService/Crud';

export const urlEditCrud = {
    form: {
        title: "Modification d'une url",
        initialSchema: urlInitialSchema,
        validationSchema: urlValidationSchema,
    },
    ...urlForm,
};

export const EditUrl = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [url, setUrl] = useState(null);

    const getUrl = async (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.urlApi.getOneUrl(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.URL_BASE_PATH);
                return;
            }

            setUrl(result.url);
        });
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.URL_BASE_PATH);
            return;
        }

        getUrl(id);
    }, [id]);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.urlApi.editUrl(id, values);
            if (result.result) {
                NotificationManager.success("L'url a bien été modifié.", 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getUrlAction());
                navigate(Constant.URL_BASE_PATH);
            }
        });
    };

    if (!url) {
        return <></>;
    }

    return <Component.CmtCrudForm handleSubmit={handleSubmit} initialValues={url} formCrud={Crud?.url?.edit} />;
};
