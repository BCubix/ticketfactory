import React, { useEffect } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { EVENTS_BASE_PATH, REDIRECTION_TIME } from '../../../Constant';
import { categoriesSelector, getCategoriesAction } from '../../../redux/categories/categoriesSlice';
import { getRoomsAction, roomsSelector } from '../../../redux/rooms/roomsSlice';
import { getSeasonsAction, seasonsSelector } from '../../../redux/seasons/seasonsSlice';
import { getTagsAction, tagsSelector } from '../../../redux/tags/tagsSlice';
import { getEventsAction } from '../../../redux/events/eventsSlice';
import eventsApi from '../../../services/api/eventsApi';
import { EventsForm } from '../EventsForm/EventsForm';
import authApi from '../../../services/api/authApi';
import { loginFailure } from '../../../redux/profile/profileSlice';

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
            NotificationManager.error("Une erreur s'est produite", 'Erreur', REDIRECTION_TIME);

            navigate(EVENTS_BASE_PATH);

            return;
        }
    }, [categoriesData, roomsData, seasonsData, tagsData]);

    const handlesubmit = async (values) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await eventsApi.createEvent(values);

        if (result.result) {
            NotificationManager.success("L'évènement a bien été créé.", 'Succès', REDIRECTION_TIME);

            dispatch(getEventsAction());

            navigate(EVENTS_BASE_PATH);
        }
    };

    return (
        <EventsForm
            handleSubmit={handlesubmit}
            categoriesList={categoriesData?.categories}
            roomsList={roomsData.rooms}
            seasonsList={seasonsData.seasons}
            tagsList={tagsData.tags}
        />
    );
};
