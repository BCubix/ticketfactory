import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getMediaCategoriesAction } from '@Redux/mediaCategories/mediaCategoriesSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const CreateMediaCategory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [mediaCategoriesData, setMediaCategoriesData] = useState(null);
    const [initialValues, setInitialValues] = useState(null);

    const [queryParameters] = useSearchParams();
    const mediaCategoryId = queryParameters.get('mediaCategoryId');
    const languageId = queryParameters.get('languageId');
    const parentId = queryParameters.get('parentId');

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            Api.mediaCategoriesApi.getMediaCategories({ lang: languageId }).then((mediaCategoriesList) => {
                if (!mediaCategoriesList.result) {
                    NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                    navigate(Constant.MEDIA_CATEGORIES_BASE_PATH);
                    return;
                }

                setMediaCategoriesData(mediaCategoriesList);
            });

            if (!mediaCategoryId || !languageId || initialValues) {
                return;
            }

            Api.mediaCategoriesApi.getTranslated(mediaCategoryId, languageId).then((mediaCategory) => {
                if (!mediaCategory?.result) {
                    NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                    navigate(Constant.MEDIA_CATEGORIES_BASE_PATH);
                    return;
                }

                setInitialValues(mediaCategory.mediaCategory);
            });
        });
    }, []);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediaCategoriesApi.createMediaCategory(values);

            if (result.result) {
                NotificationManager.success('La catégorie de média a bien été créée.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getMediaCategoriesAction());
                navigate(Constant.MEDIA_CATEGORIES_BASE_PATH);
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
    };

    if (mediaCategoryId && !initialValues) {
        return <></>;
    }

    return (
        <Component.MediaCategoriesForm
            handleSubmit={handleSubmit}
            mediaCategoriesList={mediaCategoriesData?.mediaCategories}
            translateInitialValues={initialValues}
            parentId={parseInt(parentId) || null}
        />
    );
};
