import React from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { loginFailure } from '@Redux/profile/profileSlice';
import { getSeasonsAction } from '@Redux/seasons/seasonsSlice';

export const CreateSeason = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.seasonsApi.createSeason(values);

        if (result.result) {
            NotificationManager.success('La saison a bien été créée.', 'Succès', Constant.REDIRECTION_TIME);

            dispatch(getSeasonsAction());

            navigate(Constant.SEASONS_BASE_PATH);
        }
    };

    return <Component.SeasonsForm handleSubmit={handleSubmit} />;
};
