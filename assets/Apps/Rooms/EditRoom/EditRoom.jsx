import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import roomsApi from '../../../services/api/roomsApi';
import { REDIRECTION_TIME, ROOMS_BASE_PATH } from '../../../Constant';
import { RoomsForm } from '../RoomsForm/RoomsForm';
import { getRoomsAction } from '../../../redux/rooms/roomsSlice';
import authApi from '../../../services/api/authApi';
import { loginFailure } from '../../../redux/profile/profileSlice';

export const EditRoom = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [room, setRoom] = useState(null);

    const getRoom = async (id) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await roomsApi.getOneRoom(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', REDIRECTION_TIME);

            navigate(ROOMS_BASE_PATH);

            return;
        }

        setRoom(result.room);
    };

    useEffect(() => {
        if (!id) {
            navigate(ROOMS_BASE_PATH);
            return;
        }

        getRoom(id);
    }, [id]);

    const handleSubmit = async (values) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await roomsApi.editRoom(id, values);

        if (result.result) {
            NotificationManager.success(
                'La salle a bien été modifiée.',
                'Succès',
                REDIRECTION_TIME
            );

            dispatch(getRoomsAction());

            navigate(ROOMS_BASE_PATH);
        }
    };

    if (!room) {
        return <></>;
    }

    return <RoomsForm handleSubmit={handleSubmit} initialValues={room} />;
};
