import React, { useEffect } from 'react';
import { NotificationManager } from 'react-notifications';
import { CATEGORIES_BASE_PATH, REDIRECTION_TIME } from '../../../Constant';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import categoriesApi from '../../../services/api/categoriesApi';
import { CategoriesForm } from '../CategoriesForm/CategoriesForm';
import { categoriesSelector, getCategoriesAction } from '../../../redux/categories/categoriesSlice';
import { loginFailure } from '../../../redux/profile/profileSlice';
import authApi from '../../../services/api/authApi';

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
            NotificationManager.error("Une erreur s'est produite", 'Erreur', REDIRECTION_TIME);

            navigate(EVENTS_BASE_PATH);

            return;
        }
    }, [categoriesData]);

    const handleSubmit = async (values) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await categoriesApi.createCategory(values);

        if (result.result) {
            NotificationManager.success(
                'La catégorie a bien été créée.',
                'Succès',
                REDIRECTION_TIME
            );

            dispatch(getCategoriesAction());

            navigate(CATEGORIES_BASE_PATH);
        }
    };

    return (
        <CategoriesForm handleSubmit={handleSubmit} categoriesList={categoriesData.categories} />
    );
};
