import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getSeasonsAction } from '@Redux/seasons/seasonsSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const CreateSeason = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState(null);

    const [queryParameters] = useSearchParams();
    const seasonId = queryParameters.get('seasonId');
    const languageId = queryParameters.get('languageId');

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            if (!seasonId || !languageId) {
                return;
            }

            let season = await Api.seasonsApi.getTranslated(seasonId, languageId);
            if (!season?.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.SEASONS_BASE_PATH);
                return;
            }

            setInitialValues(season.season);
        });
    }, []);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.seasonsApi.createSeason(values);
            if (result.result) {
                NotificationManager.success('La saison a bien été créée.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getSeasonsAction());
                navigate(Constant.SEASONS_BASE_PATH);
            }
        });
    };

    if (seasonId && !initialValues) {
        return <></>;
    }

    return <Component.SeasonsForm handleSubmit={handleSubmit} translateInitialValues={initialValues} />;
};
