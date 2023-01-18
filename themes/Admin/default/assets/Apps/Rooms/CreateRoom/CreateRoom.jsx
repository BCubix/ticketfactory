import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getRoomsAction } from '@Redux/rooms/roomsSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const CreateRoom = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState(null);

    const [queryParameters] = useSearchParams();
    const roomId = queryParameters.get('roomId');
    const languageId = queryParameters.get('languageId');

    useEffect(() => {
        if (!roomId || !languageId) {
            return;
        }

        apiMiddleware(dispatch, async () => {
            let room = await Api.roomsApi.getTranslated(roomId, languageId);
            if (!room?.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.ROOMS_BASE_PATH);
                return;
            }

            setInitialValues(room.room);
        });
    }, []);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.roomsApi.createRoom(values);
            if (result.result) {
                NotificationManager.success('La salle a bien été créée.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getRoomsAction());
                navigate(Constant.ROOMS_BASE_PATH);
            }
        });
    };

    if (roomId && !initialValues) {
        return <></>;
    }

    return <Component.RoomsForm handleSubmit={handleSubmit} translateInitialValues={initialValues} />;
};
