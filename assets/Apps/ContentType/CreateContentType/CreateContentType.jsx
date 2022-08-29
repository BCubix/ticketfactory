import React from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CONTENT_TYPES_BASE_PATH, REDIRECTION_TIME } from '../../../Constant';
import { loginFailure } from '../../../redux/profile/profileSlice';
import { getRoomsAction } from '../../../redux/rooms/roomsSlice';
import authApi from '../../../services/api/authApi';
import contentTypesApi from '../../../services/api/contentTypesApi';
import { ContentTypeForm } from '../ContentTypeForm/ContentTypeForm';

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
                'Le type de contenus à bien été crée.',
                'Succès',
                REDIRECTION_TIME
            );

            dispatch(getRoomsAction());

            navigate(CONTENT_TYPES_BASE_PATH);
        }
    };

    return <ContentTypeForm handleSubmit={handleSubmit} />;
};
