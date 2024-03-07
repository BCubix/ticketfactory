import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import { getMediaCategoriesAction } from '@Apps/MediaCategories/redux/mediaCategories/mediaCategoriesSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { mediaCategoriesInitialSchema, mediaCategoriesValidationSchema, mediaCategoriesForm } from '../MediaCategoriesForm/MediaCategoriesForm';

export const mediaCategoriesEditCrud = {
    form: {
        title: "Modification d'une catégorie",
        initialSchema: mediaCategoriesInitialSchema,
        validationSchema: mediaCategoriesValidationSchema,
    },
    ...mediaCategoriesForm,
};

export const EditMediaCategory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [mediaCategory, setMediaCategory] = useState(null);
    const [mediaCategoriesData, setMediaCategoriesData] = useState(null);

    useEffect(() => {}, [mediaCategoriesData]);

    const getMediaCategory = async (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediaCategoriesApi.getOneMediaCategory(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.MEDIA_CATEGORIES_BASE_PATH);
                return;
            }

            setMediaCategory(result.mediaCategory);

            Api.mediaCategoriesApi.getMediaCategories({ lang: result?.mediaCategory?.lang?.id }).then((mediaCategoriesList) => {
                if (!mediaCategoriesList.result) {
                    NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                    navigate(Constant.MEDIA_CATEGORIES_BASE_PATH);
                    return;
                }

                setMediaCategoriesData(mediaCategoriesList);
            });
        });
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.MEDIA_CATEGORIES_BASE_PATH);
            return;
        }

        getMediaCategory(id);
    }, [id]);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediaCategoriesApi.editMediaCategory(id, values);
            if (result.result) {
                NotificationManager.success('La catégorie de média a bien été modifiée.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getMediaCategoriesAction());
                navigate(Constant.MEDIA_CATEGORIES_BASE_PATH);
            } else if (result?.error?.httpcode >= 400 && result?.error?.httpcode <= 500) {
                NotificationManager.error(result?.error?.message, 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
    };

    if (!mediaCategory) {
        return <></>;
    }

    return (
        <Component.CmtCrudForm
            handleSubmit={handleSubmit}
            initialValues={mediaCategory}
            mediaCategoriesList={mediaCategoriesData?.mediaCategories}
            formCrud={Crud?.mediaCategories?.edit}
        />
    );
};
