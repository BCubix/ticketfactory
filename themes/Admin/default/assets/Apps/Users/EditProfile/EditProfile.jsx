import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getUsersAction } from '@Redux/users/usersSlice';
import { useSelector } from 'react-redux';
import { profileSelector } from '../../../redux/profile/profileSlice';
import { apiMiddleware } from '../../../services/utils/apiMiddleware';

export const EditProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(profileSelector);
    const [profile, setProfile] = useState(null);

    const getProfile = async () => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.usersApi.getOneUser(user?.id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);

                navigate(Constant.USER_BASE_PATH);
                return;
            }

            setProfile(result.user);
        });
    };

    useEffect(() => {
        if (!user?.id) {
            navigate(Constant.USER_BASE_PATH);
            return;
        }

        getProfile();
    }, [user]);

    const handleSubmit = (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.usersApi.editUser(id, values);
            if (result.result) {
                NotificationManager.success('Votre profile a bien été modifié.', 'Succès', Constant.REDIRECTION_TIME);

                dispatch(getUsersAction());
                navigate(Constant.USER_BASE_PATH);
            }
        });
    };

    if (!profile) {
        return <></>;
    }

    return <Component.EditProfileForm handleSubmit={handleSubmit} initialValues={profile} />;
};
