import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { CONTENT_BASE_PATH, REDIRECTION_TIME } from '../../../Constant';
import { getContentsAction } from '../../../redux/contents/contentsSlice';
import {
    contentTypesSelector,
    getContentTypesAction,
} from '../../../redux/contentTypes/contentTypesSlice';
import { loginFailure } from '../../../redux/profile/profileSlice';
import authApi from '../../../services/api/authApi';
import contentsApi from '../../../services/api/contentsApi';
import { ContentsForm } from '../ContentsForm/ContentsForm';

export const EditContent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [content, setContent] = useState(null);
    const { loading, contentTypes, error } = useSelector(contentTypesSelector);

    const handleSubmit = async (values) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await contentsApi.editContent(id, values);

        if (result.result) {
            NotificationManager.success(
                'Le contenu a bien été modifié.',
                'Succès',
                REDIRECTION_TIME
            );

            dispatch(getContentsAction());

            navigate(CONTENT_BASE_PATH);
        }
    };

    useEffect(() => {
        if (!loading && !contentTypes && !error) {
            dispatch(getContentTypesAction());
        }
    }, []);

    const getContent = async (id) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await contentsApi.getOneContent(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', REDIRECTION_TIME);

            navigate(CONTENT_BASE_PATH);

            return;
        }

        setContent(result.content);
    };

    useEffect(() => {
        if (!id) {
            navigate(CONTENT_BASE_PATH);
            return;
        }

        getContent(id);
    }, [id]);

    if (!content) {
        return <></>;
    }

    return (
        <ContentsForm
            handleSubmit={handleSubmit}
            initialValues={content}
            selectedContentType={content?.contentType}
        />
    );
};
