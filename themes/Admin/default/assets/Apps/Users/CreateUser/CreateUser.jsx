import React from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { getUsersAction } from '@Redux/users/usersSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const CreateUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.usersApi.createUser(values);
            if (result.result) {
                NotificationManager.success("L'utilisateur a bien été créé.", 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getUsersAction());
                navigate(Constant.USER_BASE_PATH);
            }
        });
    };

    return <Component.CreateUserForm handleSubmit={handleSubmit} />;
};
