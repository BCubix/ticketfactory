import React, { useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import { getContentTypesAction } from '@Apps/ContentTypes/redux/contentTypes/contentTypesSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { contentTypesInitialSchema, contentTypesValidationSchema, contentTypesForm } from '../ContentTypesForm/ContentTypesForm';
import { getAllContentDataAction } from '@Apps/Contents/redux/contents/contentsSlice';

export const contentTypesEditCrud = {
    form: {
        title: "Modification d'un type de contenus",
        initialSchema: contentTypesInitialSchema,
        validationSchema: contentTypesValidationSchema,
        formProps: {
            validateOnChange: false,
            validateOnBlur: true,
        },
    },
    ...contentTypesForm,
};

export const EditContentType = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [contentType, setContentType] = useState(null);
    const [pagesList, setPagesList] = useState(null);

    const getContentType = async (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.contentTypesApi.getOneContentType(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.CONTENT_TYPES_BASE_PATH);
                return;
            }

            setContentType(result.contentType);
        });
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.CONTENT_TYPES_BASE_PATH);
            return;
        }

        getContentType(id);
    }, [id]);

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
        return Crud.contentTypes.edit.contentTypeFields;
    }, []);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.contentTypesApi.editContentType(id, values);

            if (result.result) {
                NotificationManager.success('Le type de contenus a bien été modifié.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getContentTypesAction());
                dispatch(getAllContentDataAction());
                navigate(Constant.CONTENT_TYPES_BASE_PATH);
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
    };

    if (!contentType || !pagesList) {
        return <></>;
    }

    return (
        <Component.CmtCrudForm
            handleSubmit={handleSubmit}
            initialValues={contentType}
            pagesList={pagesList}
            getContentTypesModules={getContentTypesModules}
            formCrud={Crud?.contentTypes?.edit}
        />
    );
};
