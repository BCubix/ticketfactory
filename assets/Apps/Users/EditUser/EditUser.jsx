import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import usersApi from '../../../services/api/usersApi';
import { EditUserForm } from '../UserForm/EditUserForm';
import { getUsersAction } from '@Redux/users/usersSlice';
import { REDIRECTION_TIME, USER_BASE_PATH } from '../../../Constant';
import authApi from '../../../services/api/authApi';
import { loginFailure } from '../../../redux/profile/profileSlice';

export const EditUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState(null);

    const getUser = async (id) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await usersApi.getOneUser(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', REDIRECTION_TIME);

            navigate(USER_BASE_PATH);

            return;
        }

        setUser(result.user);
    };

    useEffect(() => {
        if (!id) {
            navigate(USER_BASE_PATH);
            return;
        }

        getUser(id);
    }, [id]);

    const handleSubmit = async (values) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await usersApi.editUser(id, values);

        if (result.result) {
            NotificationManager.success(
                "L'utilisateur à bien été modifié.",
                'Succès',
                REDIRECTION_TIME
            );

            dispatch(getUsersAction());

            navigate(USER_BASE_PATH);
        }
    };

    if (!user) {
        return <></>;
    }

    return <EditUserForm handleSubmit={handleSubmit} initialValues={user} />;
};
