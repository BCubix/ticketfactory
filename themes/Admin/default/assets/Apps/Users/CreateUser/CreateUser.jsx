import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { createUsersInitialSchema, createUsersValidationSchema, createUsersForm } from '../UserForm/CreateUserForm';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import { getUsersAction } from '@Apps/Users/redux/users/usersSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const usersCreateCrud = {
    form: {
        title: "Creation d'un utilisateur",
        initialSchema: createUsersInitialSchema,
        validationSchema: createUsersValidationSchema,
    },
    ...createUsersForm,
};

export const CreateUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [profilesData, setProfilesData] = useState(null);

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.profilesApi.getAllProfiles();
            if (!result?.result) {
                NotificationManager.error('Une erreur est survenue', 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.USER_BASE_PATH);
            }

            setProfilesData(result);
        });
    }, []);

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

    return <Component.CmtCrudForm handleSubmit={handleSubmit} formCrud={Crud?.users?.add} profilesList={profilesData?.profiles || []} />;
};
