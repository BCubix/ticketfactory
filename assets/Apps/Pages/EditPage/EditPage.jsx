import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';

import authApi from '@Services/api/authApi';
import pagesApi from '@Services/api/pagesApi';
import { loginFailure } from '@Redux/profile/profileSlice';
import { getPagesAction } from '@Redux/pages/pagesSlice';

import { PAGES_BASE_PATH, REDIRECTION_TIME } from '@/Constant';

import PagesForm from '@Apps/Pages/PagesForm/PagesForm';

function EditPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const [page, setPage] = useState(null);

    async function getPage(id) {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await pagesApi.getOnePage(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', REDIRECTION_TIME);

            navigate(PAGES_BASE_PATH);

            return;
        }

        setPage(result.page);
    }

    useEffect(() => {
        if (!id) {
            navigate(PAGES_BASE_PATH);
            return;
        }

        getPage(id);
    }, [id]);

    async function handleSubmit(values) {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await pagesApi.editPage(id, values);

        if (result.result) {
            NotificationManager.success('La page a bien été modifiée.', 'Succès', REDIRECTION_TIME);

            dispatch(getPagesAction());

            navigate(PAGES_BASE_PATH);
        }
    }

    if (!page) {
        return <></>;
    }

    return <PagesForm handleSubmit={handleSubmit} initialValues={page} />;
}

export default EditPage;
