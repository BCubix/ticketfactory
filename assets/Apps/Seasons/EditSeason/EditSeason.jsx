import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import seasonsApi from '../../../services/api/seasonsApi';
import { REDIRECTION_TIME, SEASONS_BASE_PATH } from '../../../Constant';
import { SeasonsForm } from '../SeasonsForm/SeasonsForm';
import { getSeasonsAction } from '../../../redux/seasons/seasonsSlice';
import authApi from '../../../services/api/authApi';
import { loginFailure } from '../../../redux/profile/profileSlice';

export const EditSeason = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [season, setSeason] = useState(null);

    const getSeason = async (id) => {
        const result = await seasonsApi.getOneSeason(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', REDIRECTION_TIME);

            navigate(SEASONS_BASE_PATH);

            return;
        }

        setSeason(result.season);
    };

    useEffect(() => {
        if (!id) {
            navigate(SEASONS_BASE_PATH);
            return;
        }

        getSeason(id);
    }, [id]);

    const handleSubmit = async (values) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await seasonsApi.editSeason(id, values);

        if (result.result) {
            NotificationManager.success(
                'La saison à bien été modifié.',
                'Succès',
                REDIRECTION_TIME
            );

            dispatch(getSeasonsAction());

            navigate(SEASONS_BASE_PATH);
        }
    };

    if (!season) {
        return <></>;
    }

    return <SeasonsForm handleSubmit={handleSubmit} initialValues={season} />;
};
