import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getCategoriesAction } from '@Redux/categories/categoriesSlice';
import { loginFailure } from '@Redux/profile/profileSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const CreateCategory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [categoriesData, setCategoriesData] = useState(null);
    const [initialValues, setInitialValues] = useState(null);

    const [queryParameters] = useSearchParams();
    const categoryId = queryParameters.get('categoryId');
    const languageId = queryParameters.get('languageId');
    const parentId = queryParameters.get('parentId');

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            Api.categoriesApi.getCategories({ lang: languageId }).then((categoriesList) => {
                if (!categoriesList.result) {
                    NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                    navigate(`${Constant.CATEGORIES_BASE_PATH}${parentId ? `/${parentId}` : ''}`);
                    return;
                }

                setCategoriesData(categoriesList);
            });

            if (!categoryId || !languageId || initialValues) {
                return;
            }

            Api.categoriesApi.getTranslated(categoryId, languageId).then((category) => {
                if (!category?.result) {
                    NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                    navigate(`${Constant.CATEGORIES_BASE_PATH}${parentId ? `/${parentId}` : ''}`);
                    return;
                }

                setInitialValues(category.category);
            });
        });
    }, []);

    const handleSubmit = async (values) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.categoriesApi.createCategory(values);

        if (result.result) {
            NotificationManager.success('La catégorie a bien été créée.', 'Succès', Constant.REDIRECTION_TIME);
            dispatch(getCategoriesAction());
            navigate(`${Constant.CATEGORIES_BASE_PATH}${parentId ? `/${parentId}` : ''}`);
        }
    };

    if (categoryId && !initialValues) {
        return <></>;
    }

    return (
        <Component.CategoriesForm
            handleSubmit={handleSubmit}
            categoriesList={categoriesData?.categories}
            translateInitialValues={initialValues}
            parentId={parseInt(parentId) || null}
        />
    );
};
