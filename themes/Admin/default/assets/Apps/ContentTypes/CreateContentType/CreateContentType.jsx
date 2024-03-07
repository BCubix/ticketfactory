import React, { useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import { getContentTypesAction } from '@Apps/ContentTypes/redux/contentTypes/contentTypesSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { contentTypesInitialSchema, contentTypesValidationSchema, contentTypesForm } from '../ContentTypesForm/ContentTypesForm';

export const contentTypesCreateCrud = {
    form: {
        title: "Création d'un type de contenus",
        initialSchema: contentTypesInitialSchema,
        validationSchema: contentTypesValidationSchema,
        formProps: {
            validateOnChange: false,
            validateOnBlur: true,
        },
    },
    ...contentTypesForm,
};

export const CreateContentType = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [pagesList, setPagesList] = useState(null);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.contentTypesApi.createContentType(values);

            if (result.result) {
                NotificationManager.success('Le type de contenu a bien été créé.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getContentTypesAction());
                navigate(Constant.CONTENT_TYPES_BASE_PATH);
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
    };

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            const pages = await Api.pagesApi.getAllPages();
            if (pages?.error) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.CONTENT_TYPES_BASE_PATH);
                return;
            }

            setPagesList(pages.pages);
        });
    }, []);

    const getContentTypesModules = useMemo(() => {
        return Crud.contentTypes.add.contentTypeFields;
    }, []);

    if (!pagesList) {
        return <></>;
    }

    return <Component.CmtCrudForm handleSubmit={handleSubmit} pagesList={pagesList} getContentTypesModules={getContentTypesModules} formCrud={Crud?.contentTypes?.add} />;
};
