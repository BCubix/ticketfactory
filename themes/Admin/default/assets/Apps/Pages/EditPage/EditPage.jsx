import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getPagesAction } from '@Redux/pages/pagesSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { useSelector } from 'react-redux';
import { languagesSelector } from '@Redux/languages/languagesSlice';

export const EditPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const languagesData = useSelector(languagesSelector);
    const { id } = useParams();

    const [page, setPage] = useState(null);
    const [pagesList, setPagesList] = useState(null);

    const getPageList = (langId) => {
        apiMiddleware(dispatch, async () => {
            const pages = await Api.pagesApi.getAllPages({ sort: 'title ASC', lang: langId });
            if (pages?.error) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.PAGES_BASE_PATH);
                return;
            }

            setPagesList(pages.pages);
        });
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.PAGES_BASE_PATH);
            return;
        }

        apiMiddleware(dispatch, async () => {
            const result = await Api.pagesApi.getOnePage(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.PAGES_BASE_PATH);
                return;
            }

            setPage(result.page);
            getPageList(result.page?.lang?.id);
        });
    }, [id]);

    function handleSubmit(values) {
        apiMiddleware(dispatch, async () => {
            const result = await Api.pagesApi.editPage(id, values);
            if (result.result) {
                NotificationManager.success('La page a bien été modifiée.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getPagesAction());
                navigate(Constant.PAGES_BASE_PATH);
            }
        });
    }

    if (!page || !pagesList) {
        return <></>;
    }

    return <Component.PagesForm handleSubmit={handleSubmit} initialValues={page} pagesList={pagesList} />;
};
