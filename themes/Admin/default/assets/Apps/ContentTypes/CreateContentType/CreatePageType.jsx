import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getPageTypesAction } from '@Redux/pageTypes/pageTypesSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const CreatePageType = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [pagesList, setPagesList] = useState(null);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.contentTypesApi.createContentType(values);

            if (result.result) {
                NotificationManager.success('Le type de contenu a bien été créé.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getPageTypesAction());
                navigate(Constant.PAGE_TYPES_BASE_PATH);
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
    };

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            const pages = await Api.pagesApi.getAllPages();
            if (pages?.error) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.PAGE_TYPES_BASE_PATH);
                return;
            }

            setPagesList(pages.pages);
        });
    }, []);

    if (!pagesList) {
        return <></>;
    }

    return <Component.PageTypesForm submitForm={handleSubmit} pagesList={pagesList} />;
};
