import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { getProfilesAction } from '@Apps/Profiles/redux/profiles/profilesSlice';
import { profilesForm, profilesInitialSchema, profilesValidationSchema } from '@Apps/Profiles/ProfilesForm/ProfilesForm';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const profilesEditCrud = {
    form: {
        title: "Modification d'un profil",
        initialSchema: profilesInitialSchema,
        validationSchema: profilesValidationSchema,
    },
    ...profilesForm,
};

export const EditProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [rolesData, setRolesData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            const [profileResult, rolesResult] = await Promise.all([Api.profilesApi.getOneProfile(id), Api.rolesApi.getRoles()]);
            console.log('ok', profileResult, rolesResult);
            if (profileResult?.result && rolesResult?.result) {
                setProfile(profileResult.profile);
                setRolesData(rolesResult);
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
            console.log(id, values);
            const result = await Api.profilesApi.editProfile(id, values);
            if (result.result) {
                NotificationManager.success('Le profil a bien été modifié.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getProfilesAction());
                navigate(Constant.PROFILES_BASE_PATH);
            }
        });
    };

    if (loading) {
        return <></>;
    }

    return <Component.CmtCrudForm handleSubmit={handleSubmit} formCrud={Crud.profiles.edit} rolesList={rolesData?.roles || []} initialValues={profile} />;
};
