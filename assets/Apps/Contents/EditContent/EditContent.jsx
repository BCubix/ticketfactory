import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { getContentsAction } from '@Redux/contents/contentsSlice';
import { contentTypesSelector, getContentTypesAction } from '@Redux/contentTypes/contentTypesSlice';
import { loginFailure } from '@Redux/profile/profileSlice';

export const EditContent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [content, setContent] = useState(null);
    const { loading, contentTypes, error } = useSelector(contentTypesSelector);

    const handleSubmit = async (values) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.contentsApi.editContent(id, values);

        if (result.result) {
            NotificationManager.success(
                'Le contenu a bien été modifié.',
                'Succès',
                Constant.REDIRECTION_TIME
            );

            dispatch(getContentsAction());

            navigate(Constant.CONTENT_BASE_PATH);
        }
    };

    useEffect(() => {
        if (!loading && !contentTypes && !error) {
            dispatch(getContentTypesAction());
        }
    }, []);

    const getContent = async (id) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.contentsApi.getOneContent(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);

            navigate(Constant.CONTENT_BASE_PATH);

            return;
        }

        setContent(result.content);
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.CONTENT_BASE_PATH);
            return;
        }

        getContent(id);
    }, [id]);

    if (!content) {
        return <></>;
    }

    return (
        <Component.ContentsForm
            handleSubmit={handleSubmit}
            initialValues={content}
            selectedContentType={content?.contentType}
        />
    );
};
