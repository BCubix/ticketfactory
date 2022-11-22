import React from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { loginFailure } from '@Redux/profile/profileSlice';
import { getTagsAction } from '@Redux/tags/tagsSlice';

export const CreateTag = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.tagsApi.createTag(values);

        if (result.result) {
            NotificationManager.success('Le tag a bien été créé.', 'Succès', Constant.REDIRECTION_TIME);

            dispatch(getTagsAction());

            navigate(Constant.TAGS_BASE_PATH);
        }
    };

    return <Component.TagsForm handleSubmit={handleSubmit} />;
};
