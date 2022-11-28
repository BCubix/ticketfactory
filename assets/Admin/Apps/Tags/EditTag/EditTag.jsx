import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { loginFailure } from '@Redux/profile/profileSlice';
import { getTagsAction } from '@Redux/tags/tagsSlice';

export const EditTag = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [tag, setTag] = useState(null);

    const getTag = async (id) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.tagsApi.getOneTag(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);

            navigate(Constant.CATEGORIES_BASE_PATH);

            return;
        }

        setTag(result.tag);
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.CATEGORIES_BASE_PATH);
            return;
        }

        getTag(id);
    }, [id]);

    const handleSubmit = async (values) => {
        const result = await Api.tagsApi.editTag(id, values);

        if (result.result) {
            NotificationManager.success(
                'La catégorie a bien été modifiée.',
                'Succès',
                Constant.REDIRECTION_TIME
            );

            dispatch(getTagsAction());

            navigate(Constant.TAGS_BASE_PATH);
        }
    };

    if (!tag) {
        return <></>;
    }

    return <Component.TagsForm handleSubmit={handleSubmit} initialValues={tag} />;
};
