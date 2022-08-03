import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import usersApi from '../../../services/api/usersApi';
import { EditUserForm } from '../UserForm/EditUserForm';
import { getUsersAction } from '@Redux/users/usersSlice';
import { REDIRECTION_TIME, USER_BASE_PATH } from '../../../Constant';

export const EditUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [initialValues, setInitialValues] = useState(null);

    const getUser = async (id) => {
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

    useEffect(() => {
        if (!user) {
            return;
        }

        setInitialValues({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: '',
            confirmPassword: '',
        });
    }, [user]);

    const handleSubmit = async (values) => {
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

    if (!initialValues) {
        return <></>;
    }

    return <EditUserForm handleSubmit={handleSubmit} initialValues={initialValues} />;
};
