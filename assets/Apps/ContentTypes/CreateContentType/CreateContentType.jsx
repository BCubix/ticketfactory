import React, { useEffect } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CONTENT_TYPES_BASE_PATH, REDIRECTION_TIME } from '../../../Constant';
import {
    contentTypeFieldsSelector,
    getContentTypeFieldsAction,
} from '../../../redux/contentTypeFields/contentTypeFieldsSlice';
import { loginFailure } from '../../../redux/profile/profileSlice';
import { getRoomsAction } from '../../../redux/rooms/roomsSlice';
import authApi from '../../../services/api/authApi';
import contentTypesApi from '../../../services/api/contentTypesApi';
import { ContentTypesForm } from '../ContentTypesForm/ContentTypesForm';

export const CreateContentType = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, contentTypeFields, error } = useSelector(contentTypeFieldsSelector);

    useEffect(() => {
        if (!loading && !contentTypeFields && !error) {
            dispatch(getContentTypeFieldsAction());
        }
    }, []);

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

    if (!contentTypeFields) {
        return <></>;
    }

    return <ContentTypesForm handleSubmit={handleSubmit} />;
};
