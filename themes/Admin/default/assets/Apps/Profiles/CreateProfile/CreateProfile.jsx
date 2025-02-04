import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { profilesForm, profilesInitialSchema, profilesValidationSchema } from '@Apps/Profiles/ProfilesForm/ProfilesForm';
import { getProfilesAction } from '@Apps/Profiles/redux/profiles/profilesSlice';

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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.rolesApi.getRoles();
            if (result?.result) {
                setRolesData(result);
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.PROFILES_BASE_PATH);

                return;
            }

            setLoading(false);
        });
    }, []);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.profilesApi.createProfile(values);
            if (result.result) {
                NotificationManager.success("L'utilisateur a bien été créé.", 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getProfilesAction());
                navigate(Constant.PROFILES_BASE_PATH);
            }
        });
    };

    if (loading) {
        return <></>;
    }

    return <Component.CmtCrudForm handleSubmit={handleSubmit} formCrud={Crud.profiles.add} rolesList={rolesData?.roles || []} />;
};
