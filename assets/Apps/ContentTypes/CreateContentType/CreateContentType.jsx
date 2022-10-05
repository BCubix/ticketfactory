import React from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CONTENT_TYPES_BASE_PATH, REDIRECTION_TIME } from '../../../Constant';
import { getContentTypesAction } from '../../../redux/contentTypes/contentTypesSlice';
import { loginFailure } from '../../../redux/profile/profileSlice';
import authApi from '../../../services/api/authApi';
import contentTypesApi from '../../../services/api/contentTypesApi';
import { ContentTypesForm } from '../ContentTypesForm/ContentTypesForm';

export const CreateContentType = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await contentTypesApi.createContentType(values);

        if (result.result) {
            NotificationManager.success(
                'Le type de contenu à bien été crée.',
                'Succès',
                REDIRECTION_TIME
            );

            dispatch(getContentTypesAction());

            navigate(CONTENT_TYPES_BASE_PATH);
        }
    };

    return <ContentTypesForm submitForm={handleSubmit} />;
};
