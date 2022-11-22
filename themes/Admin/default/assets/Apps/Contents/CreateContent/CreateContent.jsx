import React, { useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { getContentsAction } from '@Redux/contents/contentsSlice';
import { contentTypesSelector, getContentTypesAction } from '@Redux/contentTypes/contentTypesSlice';
import { loginFailure } from '@Redux/profile/profileSlice';

export const CreateContent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, contentTypes, error } = useSelector(contentTypesSelector);
    const [selectedContentType, setSelectedContentType] = useState(null);
    const { search } = useLocation();

    const urlParams = useMemo(() => new URLSearchParams(search), [search]);

    const handleSubmit = async (values) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.contentsApi.createContent(values);

        if (result.result) {
            NotificationManager.success('Le contenu a bien été créé.', 'Succès', Constant.REDIRECTION_TIME);

            dispatch(getContentsAction());

            navigate(Constant.CONTENT_BASE_PATH);
        }
    };

    useEffect(() => {
        if (!loading && !contentTypes && !error) {
            dispatch(getContentTypesAction());
        }
    }, []);

    useEffect(() => {
        if (!contentTypes) {
            return;
        }

        const urlId = parseInt(urlParams.get('contentType'));

        if (!urlId) {
            NotificationManager.error(
                "Le type de contenu n'a pas été renseigné",
                'Erreur',
                Constant.REDIRECTION_TIME
            );
            navigate(Constant.CONTENT_BASE_PATH);
        }

        const contentType = contentTypes?.find((el) => el.id === urlId);

        if (!contentType) {
            NotificationManager.error(
                'Le type de contenu renseigné ne correspond à aucun type connu.',
                'Erreur',
                Constant.REDIRECTION_TIME
            );
            navigate(Constant.CONTENT_BASE_PATH);
        }

        setSelectedContentType(contentType);
    }, [contentTypes]);

    if (!contentTypes || !selectedContentType) {
        return <></>;
    }

    return (
        <Component.ContentsForm
            handleSubmit={handleSubmit}
            contentTypeList={contentTypes}
            selectedContentType={selectedContentType}
        />
    );
};
