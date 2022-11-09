import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import tagsApi from '../../../services/api/tagsApi';
import { getTagsAction } from '@Redux/tags/tagsSlice';
import { CATEGORIES_BASE_PATH, REDIRECTION_TIME, TAGS_BASE_PATH } from '../../../Constant';
import { TagsForm } from '../TagsForm/TagsForm';
import { loginFailure } from '../../../redux/profile/profileSlice';
import authApi from '../../../services/api/authApi';

export const EditTag = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [tag, setTag] = useState(null);

    const getTag = async (id) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await tagsApi.getOneTag(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', REDIRECTION_TIME);

            navigate(CATEGORIES_BASE_PATH);

            return;
        }

        setTag(result.tag);
    };

    useEffect(() => {
        if (!id) {
            navigate(CATEGORIES_BASE_PATH);
            return;
        }

        getTag(id);
    }, [id]);

    const handleSubmit = async (values) => {
        const result = await tagsApi.editTag(id, values);

        if (result.result) {
            NotificationManager.success(
                'La catégorie a bien été modifiée.',
                'Succès',
                REDIRECTION_TIME
            );

            dispatch(getTagsAction());

            navigate(TAGS_BASE_PATH);
        }
    };

    if (!tag) {
        return <></>;
    }

    return <TagsForm handleSubmit={handleSubmit} initialValues={tag} />;
};
