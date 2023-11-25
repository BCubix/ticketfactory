import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getRoomsAction } from '@Apps/Rooms/redux/rooms/roomsSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { roomsInitialSchema, roomsValidationSchema, roomsForm } from '@Apps/Rooms/RoomsForm/RoomsForm';
import { Crud } from '@/AdminService/Crud';

export const roomsEditCrud = {
    form: {
        title: "Modification d'une salle",
        initialSchema: roomsInitialSchema,
        validationSchema: roomsValidationSchema,
    },
    ...roomsForm,
};

export const EditRoom = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [room, setRoom] = useState(null);

    const getRoom = async (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.roomsApi.getOneRoom(id);

            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);

                navigate(Constant.ROOMS_BASE_PATH);

                return;
            }

            setRoom(result.room);
        });
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.ROOMS_BASE_PATH);
            return;
        }

        getRoom(id);
    }, [id]);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.roomsApi.editRoom(id, values);

            if (result.result) {
                NotificationManager.success('La salle a bien été modifiée.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getRoomsAction());
                navigate(Constant.ROOMS_BASE_PATH);
            }
        });
    };

    if (!room) {
        return <></>;
    }

    return <Component.CmtCrudForm handleSubmit={handleSubmit} initialValues={room} formCrud={Crud?.rooms?.edit} />;
};
