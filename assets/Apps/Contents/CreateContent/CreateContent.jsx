import React, { useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { CONTENT_BASE_PATH, CONTENT_TYPES_BASE_PATH, REDIRECTION_TIME } from '../../../Constant';
import { getContentsAction } from '../../../redux/contents/contentsSlice';
import {
    contentTypesSelector,
    getContentTypesAction,
} from '../../../redux/contentTypes/contentTypesSlice';
import { loginFailure } from '../../../redux/profile/profileSlice';
import { getRoomsAction } from '../../../redux/rooms/roomsSlice';
import authApi from '../../../services/api/authApi';
import contentsApi from '../../../services/api/contentsApi';
import { ContentsForm } from '../ContentsForm/ContentsForm';

export const CreateContent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, contentTypes, error } = useSelector(contentTypesSelector);
    const [selectedContentType, setSelectedContentType] = useState(null);
    const { search } = useLocation();

    const urlParams = useMemo(() => new URLSearchParams(search), [search]);

    const handleSubmit = async (values) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await contentsApi.createContent(values);

        if (result.result) {
            NotificationManager.success('Le contenu à bien été crée.', 'Succès', REDIRECTION_TIME);

            dispatch(getContentsAction());

            navigate(CONTENT_BASE_PATH);
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
                REDIRECTION_TIME
            );
            navigate(CONTENT_BASE_PATH);
        }

        const contentType = contentTypes?.find((el) => el.id === urlId);

        if (!contentType) {
            NotificationManager.error(
                'Le type de contenu renseigné ne correspond à aucun type connu.',
                'Erreur',
                REDIRECTION_TIME
            );
            navigate(CONTENT_BASE_PATH);
        }

        setSelectedContentType(contentType);
    }, [contentTypes]);

    if (!contentTypes || !selectedContentType) {
        return <></>;
    }

    return (
        <ContentsForm
            handleSubmit={handleSubmit}
            contentTypeList={contentTypes}
            selectedContentType={selectedContentType}
        />
    );
};
