import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getCategoriesAction } from '@Apps/Categories/redux/categories/categoriesSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Crud } from '@/AdminService/Crud';
import { categoriesInitialSchema, categoriesValidationSchema, categoriesForm } from '../CategoriesForm/CategoriesForm';

export const categoriesEditCrud = {
    form: {
        title: "Modification d'une catégorie",
        initialSchema: categoriesInitialSchema,
        validationSchema: categoriesValidationSchema,
    },
    ...categoriesForm,
};

export const EditCategory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [categoriesData, setCategoriesData] = useState(null);

    const [queryParameters] = useSearchParams();
    const parentId = queryParameters.get('parentId');

    const getCategory = async (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.categoriesApi.getOneCategory(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(`${Constant.CATEGORIES_BASE_PATH}${parentId ? `/${parentId}` : ''}`);
                return;
            }

            setCategory(result.category);

            Api.categoriesApi.getCategories({ lang: result?.category?.lang?.id }).then((categoriesList) => {
                if (!categoriesList.result) {
                    NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                    navigate(`${Constant.CATEGORIES_BASE_PATH}${parentId ? `/${parentId}` : ''}`);
                    return;
                }

                setCategoriesData(categoriesList);
            });
        });
    };

    useEffect(() => {
        if (!id) {
            navigate(`${Constant.CATEGORIES_BASE_PATH}${parentId ? `/${parentId}` : ''}`);
            return;
        }

        getCategory(id);
    }, [id]);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.categoriesApi.editCategory(id, values);
            if (result.result) {
                NotificationManager.success('La catégorie a bien été modifiée.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getCategoriesAction());
                navigate(`${Constant.CATEGORIES_BASE_PATH}${parentId ? `/${parentId}` : ''}`);
            } else if (result?.error?.httpcode >= 400 && result?.error?.httpcode <= 500) {
                NotificationManager.error(result?.error?.message, 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
    };

    if (!category) {
        return <></>;
    }

    return <Component.CmtCrudForm handleSubmit={handleSubmit} initialValues={category} categoriesList={categoriesData?.categories} formCrud={Crud?.categories?.edit} />;
};
