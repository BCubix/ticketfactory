import React, { useEffect } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { categoriesSelector, getCategoriesAction } from '@Redux/categories/categoriesSlice';
import { getEventsAction } from '@Redux/events/eventsSlice';
import { getRoomsAction, roomsSelector } from '@Redux/rooms/roomsSlice';
import { getSeasonsAction, seasonsSelector } from '@Redux/seasons/seasonsSlice';
import { getTagsAction, tagsSelector } from '@Redux/tags/tagsSlice';
import { loginFailure } from '@Redux/profile/profileSlice';

export const CreateEvent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const categoriesData = useSelector(categoriesSelector);
    const roomsData = useSelector(roomsSelector);
    const seasonsData = useSelector(seasonsSelector);
    const tagsData = useSelector(tagsSelector);

    useEffect(() => {
        if (!categoriesData.loading && !categoriesData.categories && !categoriesData.error) {
            dispatch(getCategoriesAction());
        }

        if (!roomsData.loading && !roomsData.categories && !roomsData.error) {
            dispatch(getRoomsAction());
        }

        if (!seasonsData.loading && !seasonsData.categories && !seasonsData.error) {
            dispatch(getSeasonsAction());
        }

        if (!tagsData.loading && !tagsData.categories && !tagsData.error) {
            dispatch(getTagsAction());
        }
    }, []);

    useEffect(() => {
        if (categoriesData.error || roomsData.error || seasonsData.error || tagsData.error) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);

            navigate(Constant.EVENTS_BASE_PATH);

            return;
        }
    }, [categoriesData, roomsData, seasonsData, tagsData]);

    const handlesubmit = async (values) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.eventsApi.createEvent(values);

        if (result.result) {
            NotificationManager.success("L'évènement a bien été créé.", 'Succès', Constant.REDIRECTION_TIME);

            dispatch(getEventsAction());

            navigate(Constant.EVENTS_BASE_PATH);
        }
    };

    return (
        <Component.EventsForm
            handleSubmit={handlesubmit}
            categoriesList={categoriesData?.categories}
            roomsList={roomsData.rooms}
            seasonsList={seasonsData.seasons}
            tagsList={tagsData.tags}
        />
    );
};
