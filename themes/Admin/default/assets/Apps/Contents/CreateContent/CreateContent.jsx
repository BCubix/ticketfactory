import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
    const [initialValues, setInitialValues] = useState(null);

    const [queryParameters] = useSearchParams();
    const contentId = queryParameters.get('contentId');
    const languageId = queryParameters.get('languageId');
    const contentTypeId = queryParameters.get('contentType');

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

        const urlId = initialValues?.contentType?.id || parseInt(contentTypeId);
        if (!initialValues && !urlId) {
            NotificationManager.error("Le type de contenu n'a pas été renseigné", 'Erreur', Constant.REDIRECTION_TIME);
            navigate(Constant.CONTENT_BASE_PATH);
            return;
        }

        const contentType = contentTypes?.find((el) => el.id === urlId);
        if (!contentType) {
            NotificationManager.error('Le type de contenu renseigné ne correspond à aucun type connu.', 'Erreur', Constant.REDIRECTION_TIME);
            navigate(Constant.CONTENT_BASE_PATH);
        }

        setSelectedContentType(contentType);
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
