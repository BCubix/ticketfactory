import React, { useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getContentsAction } from '@Redux/contents/contentsSlice';
import { contentTypesSelector, getContentTypesAction } from '@Redux/contentTypes/contentTypesSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const CreateContent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, contentTypes, error } = useSelector(contentTypesSelector);
    const [selectedContentType, setSelectedContentType] = useState(null);
    const { search } = useLocation();
    const [initialValues, setInitialValues] = useState(null);
    const urlParams = useMemo(() => new URLSearchParams(search), [search]);

    const [queryParameters] = useSearchParams();
    const contentId = queryParameters.get('contentId');
    const languageId = queryParameters.get('languageId');

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.contentsApi.createContent(values);
            if (result.result) {
                NotificationManager.success('Le contenu a bien été créé.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getContentsAction());
                navigate(Constant.CONTENT_BASE_PATH);
            }
        });
    };

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            if (!contentId || !languageId) {
                return;
            }

            let content = await Api.contentsApi.getTranslated(contentId, languageId);
            if (!content?.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.CONTENT_BASE_PATH);
                return;
            }

            setInitialValues(content.content);
        });
    }, []);

    useEffect(() => {
        if (!loading && !contentTypes && !error) {
            dispatch(getContentTypesAction());
        }
    }, []);

    useEffect(() => {
        if (!contentTypes || (contentId && !initialValues)) {
            return;
        }

        const urlId = initialValues?.contentType?.id || parseInt(urlParams.get('contentType'));
        if (!initialValues && !urlId) {
            NotificationManager.error("Le type de contenu n'a pas été renseigné", 'Erreur', Constant.REDIRECTION_TIME);
            navigate(Constant.CONTENT_BASE_PATH);
            return;
        }

        apiMiddleware(dispatch, async () => {
            const result = await Api.contentTypesApi.getOneContentType(urlId);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite.", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.CONTENT_BASE_PATH);
                return;
            }

            let available = await Api.contentsApi.getAvailable(urlId);
            if (!available?.result) {
                NotificationManager.error("Une erreur s'est produite.", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.CONTENT_BASE_PATH);
                return;
            } else if (result.contentType?.maxObjectNb && result.contentType?.maxObjectNb - available.number <= 0) {
                NotificationManager.error('Vous ne pouvez plus créer de contenu avec ce type.', 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.CONTENT_BASE_PATH);
                return;
            }

            setSelectedContentType(result.contentType);
        });
    }, [contentTypes, initialValues]);

    if (!contentTypes || !selectedContentType || (contentId && !initialValues)) {
        return <></>;
    }

    return (
        <Component.ContentsForm
            handleSubmit={handleSubmit}
            contentTypeList={contentTypes}
            selectedContentType={selectedContentType || initialValues?.contentType?.id}
            translateInitialValues={initialValues}
        />
    );
};
