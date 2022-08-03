import React from 'react';
import { NotificationManager } from 'react-notifications';
import { REDIRECTION_TIME, ROOMS_BASE_PATH } from '../../../Constant';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import roomsApi from '../../../services/api/roomsApi';
import { getRoomsAction } from '../../../redux/rooms/roomsSlice';
import { RoomsForm } from '../RoomsForm/RoomsForm';

export const CreateRoom = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        const result = await roomsApi.createRoom(values);

        if (result.result) {
            NotificationManager.success('La salle à bien été crée.', 'Succès', REDIRECTION_TIME);

            dispatch(getRoomsAction());

            navigate(ROOMS_BASE_PATH);
        }
    };

    return <RoomsForm handleSubmit={handleSubmit} />;
};
