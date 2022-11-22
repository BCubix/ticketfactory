import React from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { loginFailure } from '@Redux/profile/profileSlice';
import { getRoomsAction } from '@Redux/rooms/roomsSlice';

export const CreateRoom = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.roomsApi.createRoom(values);

        if (result.result) {
            NotificationManager.success('La salle a bien été créée.', 'Succès', Constant.REDIRECTION_TIME);

            dispatch(getRoomsAction());

            navigate(Constant.ROOMS_BASE_PATH);
        }
    };

    return <Component.RoomsForm handleSubmit={handleSubmit} />;
};
