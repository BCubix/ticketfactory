import React from 'react';
import { NotificationManager } from 'react-notifications';
import { CATEGORIES_BASE_PATH, REDIRECTION_TIME, TAGS_BASE_PATH } from '../../../Constant';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import tagsApi from '../../../services/api/tagsApi';
import { getTagsAction } from '../../../redux/tags/tagsSlice';
import { loginFailure } from '../../../redux/profile/profileSlice';
import authApi from '../../../services/api/authApi';
import { TagsForm } from '../TagsForm/TagsForm';

export const CreateTag = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await tagsApi.createTag(values);

        if (result.result) {
            NotificationManager.success('Le tag à bien été crée.', 'Succès', REDIRECTION_TIME);

            dispatch(getTagsAction());

            navigate(TAGS_BASE_PATH);
        }
    };

    return <TagsForm handleSubmit={handleSubmit} />;
};
