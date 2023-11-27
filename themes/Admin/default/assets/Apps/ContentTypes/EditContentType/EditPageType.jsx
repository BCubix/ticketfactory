import React, { useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getPageTypesAction } from '@Apps/ContentTypes/redux/pageTypes/pageTypesSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Crud } from '@/AdminService/Crud';
import ContentTypesModules from '../ContentTypesForm/ContentTypeModules';
import { pageTypesInitialSchema, pageTypesValidationSchema, pageTypesForm } from '../ContentTypesForm/PageTypesForm';

export const pageTypesEditCrud = {
    form: {
        title: "Modification d'un type de page",
        initialSchema: pageTypesInitialSchema,
        validationSchema: pageTypesValidationSchema,
        formProps: {
            validateOnChange: false,
            validateOnBlur: true,
        },
    },
    ...pageTypesForm,
};

export const EditPageType = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [pageType, setPageType] = useState(null);
    const [pagesList, setPagesList] = useState(null);

    const getPageType = async (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.contentTypesApi.getOneContentType(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.PAGE_TYPES_BASE_PATH);
                return;
            }

            setPageType(result.contentType);
        });
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.PAGE_TYPES_BASE_PATH);
            return;
        }

        getPageType(id);
    }, [id]);

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            const pages = await Api.pagesApi.getAllPages();
            if (pages?.error) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.PAGE_TYPES_BASE_PATH);
                return;
            }

            setPagesList(pages.pages);
        });
    }, []);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.contentTypesApi.editContentType(id, values);

            if (result.result) {
                NotificationManager.success('Le type de contenus a bien été modifié.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getPageTypesAction());
                navigate(Constant.PAGE_TYPES_BASE_PATH);
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
    };

    const getContentTypesModules = useMemo(() => {
        return ContentTypesModules();
    }, []);

    if (!pageType || !pagesList) {
        return <></>;
    }

    return (
        <Component.CmtCrudForm
            handleSubmit={handleSubmit}
            initialValues={pageType}
            pagesList={pagesList}
            getContentTypesModules={getContentTypesModules}
            formCrud={Crud?.pageTypes?.edit}
        />
    );
};
