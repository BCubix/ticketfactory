import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { loginFailure } from '@Redux/profile/profileSlice';
import { getRoomsAction } from '@Redux/rooms/roomsSlice';

export const EditRoom = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [room, setRoom] = useState(null);

    const getRoom = async (id) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.roomsApi.getOneRoom(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);

            navigate(Constant.ROOMS_BASE_PATH);

            return;
        }

        setRoom(result.room);
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.ROOMS_BASE_PATH);
            return;
        }

        getRoom(id);
    }, [id]);

    const handleSubmit = async (values) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.roomsApi.editRoom(id, values);

        if (result.result) {
            NotificationManager.success(
                'La salle a bien été modifiée.',
                'Succès',
                Constant.REDIRECTION_TIME
            );

            dispatch(getRoomsAction());

            navigate(Constant.ROOMS_BASE_PATH);
        }
    };

    if (!room) {
        return <></>;
    }

    return <Component.RoomsForm handleSubmit={handleSubmit} initialValues={room} />;
};
