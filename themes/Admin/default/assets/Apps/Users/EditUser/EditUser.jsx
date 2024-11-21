import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { getUsersAction } from '@Apps/Users/redux/users/usersSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

import { Crud } from '@/AdminService/Crud';
import { editUsersInitialSchema, editUsersValidationSchema, editUsersForm } from '../UserForm/EditUserForm';

export const usersEditCrud = {
    form: {
        title: "Modification d'un utilisateur",
        initialSchema: editUsersInitialSchema,
        validationSchema: editUsersValidationSchema,
    },
    ...editUsersForm,
};

export const EditUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [profilesData, setProfilesData] = useState(null);

    const getUser = async (id) => {
        apiMiddleware(dispatch, async () => {
            const [profilesResult, userResult] = await Promise.all([Api.profilesApi.getAllProfiles(), Api.usersApi.getOneUser(id)]);
            if (!profilesResult.result || !userResult.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.USER_BASE_PATH);
                return;
            }

            setUser(userResult.user);
            setProfilesData(profilesResult);
        });
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.USER_BASE_PATH);
            return;
        }

        getUser(id);
    }, [id]);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.usersApi.editUser(id, values);
            if (result.result) {
                NotificationManager.success("L'utilisateur a bien été modifié.", 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getUsersAction());
                navigate(Constant.USER_BASE_PATH);
            } else {
                if (result?.error?.httpcode < 500) {
                    NotificationManager.error(result?.error?.message || "Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                }
            }
        });
    };

    if (!user) {
        return <></>;
    }

    return <Component.CmtCrudForm handleSubmit={handleSubmit} initialValues={user} formCrud={Crud?.users?.edit} profilesList={profilesData?.profiles || []} />;
};
