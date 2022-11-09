import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import redirectionsApi from '../../../services/api/redirectionsApi';
import { REDIRECTION_TIME, REDIRECTIONS_BASE_PATH } from '../../../Constant';
import { RedirectionsForm } from '../RedirectionsForm/RedirectionsForm';
import { getRedirectionsAction } from '../../../redux/redirections/redirectionsSlice';
import authApi from '../../../services/api/authApi';
import { loginFailure } from '../../../redux/profile/profileSlice';

export const EditRedirection = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [redirection, setRedirection] = useState(null);

    const getRedirection = async (id) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await redirectionsApi.getOneRedirection(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', REDIRECTION_TIME);

            navigate(REDIRECTIONS_BASE_PATH);

            return;
        }

        setRedirection(result.redirection);
    };

    useEffect(() => {
        if (!id) {
            navigate(REDIRECTIONS_BASE_PATH);
            return;
        }

        getRedirection(id);
    }, [id]);

    const handleSubmit = async (values) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await redirectionsApi.editRedirection(id, values);

        if (result.result) {
            NotificationManager.success(
                'La salle a bien été modifiée.',
                'Succès',
                REDIRECTION_TIME
            );

            dispatch(getRedirectionsAction());

            navigate(REDIRECTIONS_BASE_PATH);
        }
    };

    if (!redirection) {
        return <></>;
    }

    return <RedirectionsForm handleSubmit={handleSubmit} initialValues={redirection} />;
};
