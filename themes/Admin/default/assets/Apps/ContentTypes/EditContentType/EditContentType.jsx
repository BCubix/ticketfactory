import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { getContentTypesAction } from '@Redux/contentTypes/contentTypesSlice';
import { apiMiddleware } from "@Services/utils/apiMiddleware";

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

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.contentTypesApi.editContentType(id, values);

            if (result.result) {
                NotificationManager.success(
                    'Le type de contenus a bien été modifié.',
                    'Succès',
                    Constant.REDIRECTION_TIME
                );
                dispatch(getContentTypesAction());
                navigate(Constant.CONTENT_TYPES_BASE_PATH);
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
    };

    if (!contentType || !pagesList) {
        return <></>;
    }

    return <Component.ContentTypesForm submitForm={handleSubmit} initialValues={contentType} pagesList={pagesList} />;
};
