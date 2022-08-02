import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { EVENTS_BASE_PATH, REDIRECTION_TIME } from '../../../Constant';
import { EventsForm } from '../EventsForm/EventsForm';

export const CreateEvent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handlesubmit = async (values) => {
        const result = await usersApi.createUser(values);

        if (result.result) {
            NotificationManager.success("L'évènement à bien été crée.", 'Succès', REDIRECTION_TIME);

            dispatch(getEventsAction());

            navigate(EVENTS_BASE_PATH);
        }
    };

    return <EventsForm handleSubmit={handlesubmit} />;
};
