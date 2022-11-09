import React from 'react';
import { NotificationManager } from 'react-notifications';
import { REDIRECTION_TIME, SEASONS_BASE_PATH } from '../../../Constant';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import seasonsApi from '../../../services/api/seasonsApi';
import { getSeasonsAction } from '../../../redux/seasons/seasonsSlice';
import { SeasonsForm } from '../SeasonsForm/SeasonsForm';
import { loginFailure } from '../../../redux/profile/profileSlice';
import authApi from '../../../services/api/authApi';

export const CreateSeason = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await seasonsApi.createSeason(values);

        if (result.result) {
            NotificationManager.success('La saison a bien été créée.', 'Succès', REDIRECTION_TIME);

            dispatch(getSeasonsAction());

            navigate(SEASONS_BASE_PATH);
        }
    };

    return <SeasonsForm handleSubmit={handleSubmit} />;
};
