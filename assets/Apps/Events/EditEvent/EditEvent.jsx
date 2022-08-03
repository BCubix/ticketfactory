import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import eventsApi from '../../../services/api/eventsApi';
import { getEventsAction } from '@Redux/events/eventsSlice';
import { EVENTS_BASE_PATH, REDIRECTION_TIME } from '../../../Constant';
import { EventsForm } from '../EventsForm/EventsForm';
import { categoriesSelector, getCategoriesAction } from '../../../redux/categories/categoriesSlice';
import { getRoomsAction, roomsSelector } from '../../../redux/rooms/roomsSlice';
import { getSeasonsAction, seasonsSelector } from '../../../redux/seasons/seasonsSlice';

export const EditEvent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [initialValues, setInitialValues] = useState(null);
    const categoriesData = useSelector(categoriesSelector);
    const roomsData = useSelector(roomsSelector);
    const seasonsData = useSelector(seasonsSelector);

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
    }, []);

    useEffect(() => {
        if (categoriesData.error || roomsData.error || seasonsData.error) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', REDIRECTION_TIME);

            navigate(EVENTS_BASE_PATH);

            return;
        }
    }, [categoriesData, roomsData, seasonsData]);

    const getEvent = async (id) => {
        const result = await eventsApi.getOneEvent(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', REDIRECTION_TIME);

            navigate(EVENTS_BASE_PATH);

            return;
        }

        setEvent(result.event);
    };

    useEffect(() => {
        if (!id) {
            navigate(EVENTS_BASE_PATH);
            return;
        }

        getEvent(id);
    }, [id]);

    useEffect(() => {
        if (!event) {
            return;
        }

        setInitialValues({
            name: event.name,
            active: event.active,
            description: event.description,
            eventDates: event.eventDates,
            eventPrices: event.eventPrices,
            eventCategory: event.eventCategory?.id || '',
            room: event.room?.id || '',
            season: event.season?.id || '',
        });
    }, [event]);

    const handleSubmit = async (values) => {
        let { active, ...data } = values;

        if (active) {
            active = 1;
        } else {
            active = 0;
        }

        const result = await eventsApi.editEvent(id, { active, ...data });

        if (result.result) {
            NotificationManager.success(
                'La catégorie à bien été modifié.',
                'Succès',
                REDIRECTION_TIME
            );

            dispatch(getEventsAction());

            navigate(EVENTS_BASE_PATH);
        }
    };

    if (!initialValues) {
        return <></>;
    }

    return (
        <EventsForm
            handleSubmit={handleSubmit}
            initialValues={initialValues}
            categoriesList={categoriesData?.categories}
            roomsList={roomsData.rooms}
            seasonsList={seasonsData.seasons}
        />
    );
};
