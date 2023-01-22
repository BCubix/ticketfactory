import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getEventsAction } from '@Redux/events/eventsSlice';
import { languagesSelector } from '@Redux/languages/languagesSlice';

import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const CreateEvent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const languagesData = useSelector(languagesSelector);
    const [categoriesData, setCategoriesData] = useState(null);
    const [roomsData, setRoomsData] = useState(null);
    const [seasonsData, setSeasonsData] = useState(null);
    const [tagsData, setTagsData] = useState(null);
    const [initialValues, setInitialValues] = useState(null);

    const [queryParameters] = useSearchParams();
    const eventId = queryParameters.get('eventId');
    const languageId = queryParameters.get('languageId');

    useEffect(() => {
        if (!languageId && !languagesData?.languages) {
            return;
        }

        apiMiddleware(dispatch, async () => {
            const defaultLanguageId = languageId || languagesData?.languages?.find((el) => el.isDefault)?.id;

            Api.roomsApi.getAllRooms({ lang: defaultLanguageId }).then((results) => setRoomsData(results));
            Api.seasonsApi.getAllSeasons({ lang: defaultLanguageId }).then((results) => setSeasonsData(results));
            Api.tagsApi.getAllTags({ lang: defaultLanguageId }).then((results) => setTagsData(results));
            Api.categoriesApi.getCategories({ lang: defaultLanguageId }).then((results) => setCategoriesData(results));

            if (!eventId || !languageId) {
                return;
            }

            Api.eventsApi.getTranslated(eventId, languageId).then((event) => {
                if (!event?.result) {
                    NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                    navigate(Constant.EVENTS_BASE_PATH);
                    return;
                }

                setInitialValues(event.event);
            });
        });
    }, [languagesData?.languages]);

    useEffect(() => {
        if (categoriesData?.error || roomsData?.error || seasonsData?.error || tagsData?.error) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            navigate(Constant.EVENTS_BASE_PATH);
            return;
        }
    }, [categoriesData, roomsData, seasonsData, tagsData]);

    const handlesubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.eventsApi.createEvent(values);
            if (result.result) {
                NotificationManager.success("L'évènement a bien été créé.", 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getEventsAction());
                navigate(Constant.EVENTS_BASE_PATH);
            }
        });
    };

    if (!categoriesData || !roomsData || !seasonsData || !tagsData || (eventId && !initialValues)) {
        return <></>;
    }

    return (
        <Component.EventsForm
            handleSubmit={handlesubmit}
            categoriesList={categoriesData?.categories}
            roomsList={roomsData.rooms}
            seasonsList={seasonsData.seasons}
            tagsList={tagsData.tags}
            translateInitialValues={initialValues}
        />
    );
};
