import React, { useEffect } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { categoriesSelector, getCategoriesAction } from '@Redux/categories/categoriesSlice';
import { loginFailure } from '@Redux/profile/profileSlice';

export const CreateCategory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const categoriesData = useSelector(categoriesSelector);

    useEffect(() => {
        if (!categoriesData.loading && !categoriesData.categories && !categoriesData.error) {
            dispatch(getCategoriesAction());
        }
    }, []);

    useEffect(() => {
        if (categoriesData.error) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);

            navigate(Constant.EVENTS_BASE_PATH);

            return;
        }
    }, [categoriesData]);

    const handleSubmit = async (values) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.categoriesApi.createCategory(values);

        if (result.result) {
            NotificationManager.success(
                'La catégorie a bien été créée.',
                'Succès',
                Constant.REDIRECTION_TIME
            );

            dispatch(getCategoriesAction());

            navigate(Constant.CATEGORIES_BASE_PATH);
        }
    };

    return (
        <Component.CategoriesForm handleSubmit={handleSubmit} categoriesList={categoriesData.categories} />
    );
};
