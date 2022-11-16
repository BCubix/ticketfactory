import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { categoriesSelector, getCategoriesAction } from '@Redux/categories/categoriesSlice';
import { loginFailure } from '@Redux/profile/profileSlice';

export const EditCategory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [category, setCategory] = useState(null);
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

    const getCategory = async (id) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.categoriesApi.getOneCategory(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);

            navigate(Constant.CATEGORIES_BASE_PATH);

            return;
        }

        setCategory(result.category);
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.CATEGORIES_BASE_PATH);
            return;
        }

        getCategory(id);
    }, [id]);

    const handleSubmit = async (values) => {
        const result = await Api.categoriesApi.editCategory(id, values);

        if (result.result) {
            NotificationManager.success(
                'La catégorie a bien été modifiée.',
                'Succès',
                Constant.REDIRECTION_TIME
            );

            dispatch(getCategoriesAction());

            navigate(Constant.CATEGORIES_BASE_PATH);
        }
    };

    if (!category) {
        return <></>;
    }

    return (
        <Component.CategoriesForm
            handleSubmit={handleSubmit}
            initialValues={category}
            categoriesList={categoriesData.categories}
        />
    );
};
