import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { getPagesAction } from '@Redux/pages/pagesSlice';
import { loginFailure } from '@Redux/profile/profileSlice';

export const EditPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const [page, setPage] = useState(null);

    async function getPage(id) {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.pagesApi.getOnePage(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);

            navigate(Constant.PAGES_BASE_PATH);

            return;
        }

        setPage(result.page);
    }

    useEffect(() => {
        if (!id) {
            navigate(Constant.PAGES_BASE_PATH);
            return;
        }

        getPage(id);
    }, [id]);

    async function handleSubmit(values) {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.pagesApi.editPage(id, values);

        if (result.result) {
            NotificationManager.success('La page a bien été modifiée.', 'Succès', Constant.REDIRECTION_TIME);

            dispatch(getPagesAction());

            navigate(Constant.PAGES_BASE_PATH);
        }
    }

    if (!page) {
        return <></>;
    }

    return <Component.PagesForm handleSubmit={handleSubmit} initialValues={page} />;
}

