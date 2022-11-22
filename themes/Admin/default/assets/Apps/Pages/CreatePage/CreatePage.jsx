import React from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { getPagesAction } from '@Redux/pages/pagesSlice';
import { loginFailure } from '@Redux/profile/profileSlice';

export const CreatePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleSubmit(values) {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.pagesApi.createPage(values);

        if (result.result) {
            NotificationManager.success('La page a bien été créée.', 'Succès', Constant.REDIRECTION_TIME);

            dispatch(getPagesAction());

            navigate(Constant.PAGES_BASE_PATH);
        }
    }
    return <Component.PagesForm handleSubmit={handleSubmit} />;
}

