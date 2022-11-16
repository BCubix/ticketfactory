import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { loginFailure } from '@Redux/profile/profileSlice';
import { getUsersAction } from '@Redux/users/usersSlice';

export const EditUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState(null);

    const getUser = async (id) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.usersApi.getOneUser(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);

            navigate(Constant.USER_BASE_PATH);

            return;
        }

        setUser(result.user);
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.USER_BASE_PATH);
            return;
        }

        getUser(id);
    }, [id]);

    const handleSubmit = async (values) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.usersApi.editUser(id, values);

        if (result.result) {
            NotificationManager.success(
                "L'utilisateur a bien été modifié.",
                'Succès',
                Constant.REDIRECTION_TIME
            );

            dispatch(getUsersAction());

            navigate(Constant.USER_BASE_PATH);
        }
    };

    if (!user) {
        return <></>;
    }

    return <Component.EditUserForm handleSubmit={handleSubmit} initialValues={user} />;
};
