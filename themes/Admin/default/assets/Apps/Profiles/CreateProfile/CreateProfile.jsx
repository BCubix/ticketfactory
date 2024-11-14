import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { profilesForm, profilesInitialSchema, profilesValidationSchema } from '../ProfilesForm/ProfilesForm';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const profilesCreateCrud = {
    form: {
        title: "Creation d'un profil",
        initialSchema: profilesInitialSchema,
        validationSchema: profilesValidationSchema,
    },
    ...profilesForm,
};

export const CreateProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [rolesData, setRolesData] = useState(null);

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            Api.rolesApi.getRoles().then((results) => setRolesData(results));
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

    console.log(Crud.profiles);
    return <Component.CmtCrudForm handleSubmit={handleSubmit} formCrud={Crud.profiles.add} />;
};
