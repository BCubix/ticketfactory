import React from 'react';
import { NotificationManager } from 'react-notifications';
import { CATEGORIES_BASE_PATH, REDIRECTION_TIME } from '../../../Constant';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import categoriesApi from '../../../services/api/categoriesApi';
import { CategoriesForm } from '../CategoriesForm/CategoriesForm';
import { getCategoriesAction } from '../../../redux/categories/categoriesSlice';
import { loginFailure } from '../../../redux/profile/profileSlice';
import authApi from '../../../services/api/authApi';

export const CreateCategory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await categoriesApi.createCategory(values);

        if (result.result) {
            NotificationManager.success(
                'La catégorie à bien été crée.',
                'Succès',
                REDIRECTION_TIME
            );

            dispatch(getCategoriesAction());

            navigate(CATEGORIES_BASE_PATH);
        }
    };

    return <CategoriesForm handleSubmit={handleSubmit} />;
};
