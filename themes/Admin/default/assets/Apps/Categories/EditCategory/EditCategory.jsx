import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getCategoriesAction } from '@Redux/categories/categoriesSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const EditCategory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [categoriesData, setCategoriesData] = useState(null);

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
            }
        });
    };

    if (!category) {
        return <></>;
    }

    return <Component.CategoriesForm handleSubmit={handleSubmit} initialValues={category} categoriesList={categoriesData?.categories} />;
};
