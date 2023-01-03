import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { categoriesSelector, getCategoriesAction } from '@Redux/categories/categoriesSlice';
import { getEventsAction } from '@Redux/events/eventsSlice';
import { loginFailure } from '@Redux/profile/profileSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const EditEvent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const categoriesData = useSelector(categoriesSelector);
    const [roomsData, setRoomsData] = useState(null);
    const [seasonsData, setSeasonsData] = useState(null);
    const [tagsData, setTagsData] = useState(null);

    useEffect(() => {
        if (!categoriesData.loading && !categoriesData.categories && !categoriesData.error) {
            dispatch(getCategoriesAction());
        }

        apiMiddleware(dispatch, async () => {
            const tmpRooms = await Api.roomsApi.getAllRooms();
            const tmpSeasons = await Api.seasonsApi.getAllSeasons();
            const tmpTags = await Api.tagsApi.getAllTags();

            setRoomsData(tmpRooms);
            setSeasonsData(tmpSeasons);
            setTagsData(tmpTags);
        });
    }, []);

    useEffect(() => {
        if (categoriesData?.error || roomsData?.error || seasonsData?.error || tagsData?.error) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);

            navigate(Constant.EVENTS_BASE_PATH);

            return;
        }
    }, [categoriesData, roomsData, seasonsData, tagsData]);

    const getEvent = async (id) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.eventsApi.getOneEvent(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);

            navigate(Constant.EVENTS_BASE_PATH);

            return;
        }

        setEvent(result.event);
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.EVENTS_BASE_PATH);
            return;
        }

        getEvent(id);
    }, [id]);

    const handleSubmit = async (values) => {
        let { active, ...data } = values;

        if (active) {
            active = 1;
        } else {
            active = 0;
        }

        const result = await Api.eventsApi.editEvent(id, { active, ...data });

        if (result.result) {
            NotificationManager.success("L'évènement a bien été modifié.", 'Succès', Constant.REDIRECTION_TIME);

            dispatch(getEventsAction());

            navigate(Constant.EVENTS_BASE_PATH);
        }
    };

    if (!event || !categoriesData || !roomsData || !seasonsData || !tagsData) {
        return <></>;
    }

    return (
        <Component.EventsForm
            handleSubmit={handleSubmit}
            initialValues={event}
            categoriesList={categoriesData?.categories}
            roomsList={roomsData.rooms}
            seasonsList={seasonsData.seasons}
            tagsList={tagsData.tags}
        />
    );
};
