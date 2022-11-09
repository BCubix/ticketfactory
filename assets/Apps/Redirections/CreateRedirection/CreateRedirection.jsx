import React from 'react';
import { NotificationManager } from 'react-notifications';
import { REDIRECTIONS_BASE_PATH, REDIRECTION_TIME } from '../../../Constant';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import authApi from '../../../services/api/authApi';
import { loginFailure } from '../../../redux/profile/profileSlice';
import redirectionsApi from '../../../services/api/redirectionsApi';
import { getRedirectionsAction } from '../../../redux/redirections/redirectionsSlice';
import { RedirectionsForm } from '../RedirectionsForm/RedirectionsForm';

export const CreateRedirection = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await redirectionsApi.createRedirection(values);

        if (result.result) {
            NotificationManager.success(
                'La redirection a bien été créée.',
                'Succès',
                REDIRECTION_TIME
            );

            dispatch(getRedirectionsAction());

            navigate(REDIRECTIONS_BASE_PATH);
        }
    };

    return <RedirectionsForm handleSubmit={handleSubmit} />;
};
