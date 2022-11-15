import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';

import authApi from '@Services/api/authApi';
import pagesApi from '@Services/api/pagesApi';
import { getPagesAction } from '@Redux/pages/pagesSlice';
import { loginFailure } from '@Redux/profile/profileSlice';

import { PAGES_BASE_PATH, REDIRECTION_TIME } from '@/Constant';
import { PagesForm } from '@Apps/Pages/PagesForm/PagesForm';

export const CreatePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleSubmit(values) {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await pagesApi.createPage(values);

        if (result.result) {
            NotificationManager.success('La page a bien été créée.', 'Succès', REDIRECTION_TIME);

            dispatch(getPagesAction());

            navigate(PAGES_BASE_PATH);
        }
    }
    return <PagesForm handleSubmit={handleSubmit} />;
}

