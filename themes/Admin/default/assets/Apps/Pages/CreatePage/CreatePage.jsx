import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getPagesAction } from '@Redux/pages/pagesSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { useSelector } from 'react-redux';
import { languagesSelector } from '@Redux/languages/languagesSlice';

export const CreatePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const languagesData = useSelector(languagesSelector);
    const [initialValues, setInitialValues] = useState(null);
    const [pagesList, setPagesList] = useState(null);
    const [selectedContentType, setSelectedContentType] = useState(null);

    const [queryParameters] = useSearchParams();
    const pageId = queryParameters.get('pageId');
    const pageType = queryParameters.get('pageType');
    const languageId = queryParameters.get('languageId');

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
        if (!pageId && !pageType) {
            NotificationManager.error("Le type de page n'a pas été renseigné", 'Erreur', Constant.REDIRECTION_TIME);
            navigate(Constant.PAGES_BASE_PATH);
            return;
        }

        if (!pageType || parseInt(pageType) === 0 || (pageId && !initialValues)) {
            return;
        }

        apiMiddleware(dispatch, async () => {
            const result = await Api.contentTypesApi.getOneContentType(pageType);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite.", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.PAGES_BASE_PATH);
                return;
            }

            let available = await Api.contentsApi.getAvailable(pageType);
            if (!available?.result) {
                NotificationManager.error("Une erreur s'est produite.", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.PAGES_BASE_PATH);
                return;
            } else if (result.contentType?.maxObjectNb && result.contentType?.maxObjectNb - available.number <= 0) {
                NotificationManager.error('Vous ne pouvez plus créer de page avec ce type.', 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.PAGES_BASE_PATH);
                return;
            }

            setSelectedContentType(result.contentType);
        });
    }, [pageType, initialValues]);

    useEffect(() => {
        if ((!languageId && !languagesData?.languages) || pagesList) {
            return;
        }

        const defaultLanguageId = languageId || languagesData?.languages?.find((el) => el.isDefault)?.id;
        getPageList(defaultLanguageId);
    }, [languagesData.languages]);

    useEffect(() => {
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

    const handleCreateContent = async (values, result) => {
        values.page = result?.page?.id;

        if (selectedContentType) {
            const contentResult = await Api.contentsApi.createContent(values);
            if (!contentResult.result) {
                return;
            }
        }

        NotificationManager.success('La page a bien été créée.', 'Succès', Constant.REDIRECTION_TIME);
        dispatch(getPagesAction());
        navigate(Constant.PAGES_BASE_PATH);
    };

    function handleSubmit(values) {
        apiMiddleware(dispatch, async () => {
            const result = await Api.pagesApi.createPage(values);
            if (result.result) {
                handleCreateContent(values, result);
            }
        });
    }

    if (!pagesList || (pageType && parseInt(pageType) !== 0 && !selectedContentType) || (pageId && !initialValues)) {
        return <></>;
    }

    return <Component.PagesForm handleSubmit={handleSubmit} translateInitialValues={initialValues} pagesList={pagesList} contentType={selectedContentType} />;
};
