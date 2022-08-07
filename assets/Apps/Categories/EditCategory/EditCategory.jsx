import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import categoriesApi from '../../../services/api/categoriesApi';
import { getCategoriesAction } from '@Redux/categories/categoriesSlice';
import { CATEGORIES_BASE_PATH, REDIRECTION_TIME } from '../../../Constant';
import { CategoriesForm } from '../CategoriesForm/CategoriesForm';
import { loginFailure } from '../../../redux/profile/profileSlice';
import authApi from '../../../services/api/authApi';

export const EditCategory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [category, setCategory] = useState(null);

    const getCategory = async (id) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await categoriesApi.getOneCategory(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', REDIRECTION_TIME);

            navigate(CATEGORIES_BASE_PATH);

            return;
        }

        setCategory(result.category);
    };

    useEffect(() => {
        if (!id) {
            navigate(CATEGORIES_BASE_PATH);
            return;
        }

        getCategory(id);
    }, [id]);

    const handleSubmit = async (values) => {
        let { active, ...data } = values;

        if (active) {
            active = 1;
        } else {
            active = 0;
        }

        const result = await categoriesApi.editCategory(id, { active, ...data });

        if (result.result) {
            NotificationManager.success(
                'La catégorie à bien été modifié.',
                'Succès',
                REDIRECTION_TIME
            );

            dispatch(getCategoriesAction());

            navigate(CATEGORIES_BASE_PATH);
        }
    };

    if (!category) {
        return <></>;
    }

    return <CategoriesForm handleSubmit={handleSubmit} initialValues={category} />;
};
