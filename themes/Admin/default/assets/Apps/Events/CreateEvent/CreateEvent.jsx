import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { categoriesSelector, getCategoriesAction } from '@Redux/categories/categoriesSlice';
import { getEventsAction } from '@Redux/events/eventsSlice';
import { loginFailure } from '@Redux/profile/profileSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const CreateEvent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
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

    if (!categoriesData || !roomsData || !seasonsData || !tagsData) {
        return <></>;
    }

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
