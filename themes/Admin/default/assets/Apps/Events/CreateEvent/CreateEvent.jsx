import React, { useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getEventsAction } from '@Apps/Events/redux/events/eventsSlice';
import { languagesSelector } from '@Apps/Languages/redux/languages/languagesSlice';
import { eventsInitialSchema, eventsValidationSchema, eventsForm } from '../EventsForm/EventsForm';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Crud } from '@/AdminService/Crud';
import { parametersSelector } from '@Apps/Parameters/redux/parameters/parametersSlice';

export const eventsCreateCrud = ({ eventName }) => ({
    form: {
        title: "Création d'un évènement",
        initialSchema: eventsInitialSchema,
        validationSchema: eventsValidationSchema,
    },
    ...eventsForm,
});

export const CreateEvent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const languagesData = useSelector(languagesSelector);
    const { parameters } = useSelector(parametersSelector);
    const [categoriesData, setCategoriesData] = useState(null);
    const [roomsData, setRoomsData] = useState(null);
    const [seasonsData, setSeasonsData] = useState(null);
    const [featuresData, setFeaturesData] = useState(null);
    const [tagsData, setTagsData] = useState(null);
    const [ticketingData, setTicketingData] = useState(null);
    const [initialValues, setInitialValues] = useState(null);

    const [queryParameters] = useSearchParams();
    const eventId = queryParameters.get('eventId');
    const languageId = queryParameters.get('languageId');

    const defaultDateBlockName = useMemo(() => {
        return parameters?.find((it) => it.paramKey === 'core_default_event_date_block_name')?.paramValue || null;
    }, [parameters]);

    const defaultPriceBlockName = useMemo(() => {
        return parameters?.find((it) => it.paramKey === 'core_default_event_price_block_name')?.paramValue || null;
    }, [parameters]);

    const defaultPrices = useMemo(() => {
        return parameters?.find((it) => it.paramKey === 'core_default_event_price')?.paramValue || null;
    }, [parameters]);

    useEffect(() => {
        if (!languageId && !languagesData?.languages) {
            return;
        }

        apiMiddleware(dispatch, async () => {
            const defaultLanguageId = languageId || languagesData?.languages?.find((el) => el.isDefault)?.id;

            Api.roomsApi.getAllRooms({ lang: defaultLanguageId }).then((results) => setRoomsData(results));
            Api.seasonsApi.getAllSeasons({ lang: defaultLanguageId }).then((results) => setSeasonsData(results));
            Api.tagsApi.getAllTags({ lang: defaultLanguageId }).then((results) => setTagsData(results));
            Api.ticketingApi.getAllTicketing().then((results) => setTicketingData(results));
            Api.categoriesApi.getCategories({ lang: defaultLanguageId }).then((results) => setCategoriesData(results));
            Api.featuresApi.getAllFeatures({ lang: defaultLanguageId }).then((results) => setFeaturesData(results));

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

    if (parameters?.length === 0 || !categoriesData || !roomsData || !seasonsData || !tagsData || !ticketingData || (eventId && !initialValues)) {
        return <></>;
    }

    return (
        <Component.CmtCrudForm
            handleSubmit={handlesubmit}
            categoriesList={categoriesData?.categories}
            roomsList={roomsData.rooms}
            seasonsList={seasonsData.seasons}
            tagsList={tagsData.tags}
            ticketingList={ticketingData?.ticketing || []}
            featuresList={featuresData?.features}
            translateInitialValues={initialValues}
            formCrud={Crud?.events?.add}
            defaultPriceBlockName={defaultPriceBlockName}
            defaultDateBlockName={defaultDateBlockName}
            defaultPrices={defaultPrices}
        />
    );
};
