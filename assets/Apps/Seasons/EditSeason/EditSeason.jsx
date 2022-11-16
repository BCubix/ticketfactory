import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { loginFailure } from '@Redux/profile/profileSlice';
import { getSeasonsAction } from '@Redux/seasons/seasonsSlice';

export const EditSeason = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [season, setSeason] = useState(null);

    const getSeason = async (id) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.seasonsApi.getOneSeason(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);

            navigate(Constant.SEASONS_BASE_PATH);

            return;
        }

        setSeason(result.season);
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.SEASONS_BASE_PATH);
            return;
        }

        getSeason(id);
    }, [id]);

    const handleSubmit = async (values) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.seasonsApi.editSeason(id, values);

        if (result.result) {
            NotificationManager.success(
                'La saison a bien été modifié.',
                'Succès',
                Constant.REDIRECTION_TIME
            );

            dispatch(getSeasonsAction());

            navigate(Constant.SEASONS_BASE_PATH);
        }
    };

    if (!season) {
        return <></>;
    }

    return <Component.SeasonsForm handleSubmit={handleSubmit} initialValues={season} />;
};
