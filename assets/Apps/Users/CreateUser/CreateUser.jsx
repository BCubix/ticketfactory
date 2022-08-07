import React from 'react';
import { NotificationManager } from 'react-notifications';
import { REDIRECTION_TIME, USER_BASE_PATH } from '../../../Constant';
import usersApi from '../../../services/api/usersApi';
import { getUsersAction } from '@Redux/users/usersSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CreateUserForm } from '../UserForm/CreateUserForm';
import { loginFailure } from '../../../redux/profile/profileSlice';
import authApi from '../../../services/api/authApi';

export const CreateUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await usersApi.createUser(values);

        if (result.result) {
            NotificationManager.success(
                "L'utilisateur à bien été crée.",
                'Succès',
                REDIRECTION_TIME
            );

            dispatch(getUsersAction());

            navigate(USER_BASE_PATH);
        }
    };

    return <CreateUserForm handleSubmit={handleSubmit} />;
};
