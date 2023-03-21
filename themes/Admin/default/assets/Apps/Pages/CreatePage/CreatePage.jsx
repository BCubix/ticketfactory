import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getPagesAction } from '@Redux/pages/pagesSlice';
import { apiMiddleware } from '../../../services/utils/apiMiddleware';

export const CreatePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState(null);
    const [pagesList, setPagesList] = useState(null);

    const [queryParameters] = useSearchParams();
    const pageId = queryParameters.get('pageId');
    const languageId = queryParameters.get('languageId');

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            const pages = await Api.pagesApi.getAllPages({ sort: 'title ASC' });
            if (pages?.error) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.PAGES_BASE_PATH);
                return;
            }

            setPagesList(pages.pages);
        });

        apiMiddleware(dispatch, async () => {
            if (!pageId || !languageId) {
                return;
            }

            let page = await Api.pagesApi.getTranslated(pageId, languageId);
            if (!page?.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.PAGES_BASE_PATH);
                return;
            }

            setInitialValues(page.page);
        });
    }, []);

    function handleSubmit(values) {
        apiMiddleware(dispatch, async () => {
            const result = await Api.pagesApi.createPage(values);
            if (result.result) {
                NotificationManager.success('La page a bien été créée.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getPagesAction());
                navigate(Constant.PAGES_BASE_PATH);
            }
        });
    }

    if (!pagesList || (pageId && !initialValues)) {
        return <></>;
    }

    return <Component.PagesForm handleSubmit={handleSubmit} translateInitialValues={initialValues} pagesList={pagesList} />;
};
