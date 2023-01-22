import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getEventsAction } from '@Redux/events/eventsSlice';

import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const EditEvent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [categoriesData, setCategoriesData] = useState(null);
    const [roomsData, setRoomsData] = useState(null);
    const [seasonsData, setSeasonsData] = useState(null);
    const [tagsData, setTagsData] = useState(null);

    useEffect(() => {
        if (categoriesData?.error || roomsData?.error || seasonsData?.error || tagsData?.error) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            navigate(Constant.EVENTS_BASE_PATH);
            return;
        }
    }, [categoriesData, roomsData, seasonsData, tagsData]);

    const getEvent = async (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.eventsApi.getOneEvent(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.EVENTS_BASE_PATH);
                return;
            }

            setEvent(result.event);

            const defaultLanguageId = result?.event?.lang?.id;
            Api.roomsApi.getAllRooms({ lang: defaultLanguageId }).then((results) => setRoomsData(results));
            Api.seasonsApi.getAllSeasons({ lang: defaultLanguageId }).then((results) => setSeasonsData(results));
            Api.tagsApi.getAllTags({ lang: defaultLanguageId }).then((results) => setTagsData(results));
            Api.categoriesApi.getCategories({ lang: defaultLanguageId }).then((results) => setCategoriesData(results));
        });
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
