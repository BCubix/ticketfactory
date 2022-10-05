import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { CONTENT_TYPES_BASE_PATH, REDIRECTION_TIME } from '../../../Constant';
import { getContentTypesAction } from '../../../redux/contentTypes/contentTypesSlice';
import { loginFailure } from '../../../redux/profile/profileSlice';
import authApi from '../../../services/api/authApi';
import contentTypesApi from '../../../services/api/contentTypesApi';
import { ContentTypesForm } from '../ContentTypesForm/ContentTypesForm';

export const EditContentType = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [contentType, setContentType] = useState(null);

    const getContentType = async (id) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await contentTypesApi.getOneContentType(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', REDIRECTION_TIME);

            navigate(CONTENT_TYPES_BASE_PATH);

            return;
        }

        setContentType(result.contentType);
    };

    useEffect(() => {
        if (!id) {
            navigate(CONTENT_TYPES_BASE_PATH);
            return;
        }

        getContentType(id);
    }, [id]);

    const handleSubmit = async (values) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await contentTypesApi.editContentType(id, values);

        if (result.result) {
            NotificationManager.success(
                'Le type de contenus à bien été modifié.',
                'Succès',
                REDIRECTION_TIME
            );

            dispatch(getContentTypesAction());

            navigate(CONTENT_TYPES_BASE_PATH);
        }
    };

    if (!contentType) {
        return <></>;
    }

    return <ContentTypesForm submitForm={handleSubmit} initialValues={contentType} />;
};
