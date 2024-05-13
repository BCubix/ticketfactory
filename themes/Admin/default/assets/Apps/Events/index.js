import React from 'react';

import { CreateEvent, eventsCreateCrud } from '@Apps/Events/CreateEvent/CreateEvent';
import { EditEvent, eventsEditCrud } from '@Apps/Events/EditEvent/EditEvent';
import { DisplayEventMediaElement } from '@Apps/Events/EventsForm/EventMediaPart/DisplayEventMediaElement';
import { EditEventMediaModal } from '@Apps/Events/EventsForm/EventMediaPart/EditEventMediaModal';
import { EventMediaPartForm } from '@Apps/Events/EventsForm/EventMediaPart/EventMediaPartForm';
import { MoveEventMedias } from '@Apps/Events/EventsForm/EventMediaPart/MoveEventMedias';
import { DeleteEventMedias } from '@Apps/Events/EventsForm/EventMediaPart/DeleteEventMedias';
import { EventDateRange } from '@Apps/Events/EventsForm/EventDateRange';
import { EventParentCategoryPartForm } from '@Apps/Events/EventsForm/EventParentCategoryPartForm';
import { EventsPriceBlockForm } from '@Apps/Events/EventsForm/EventPriceBlockForm';
import { EventsDateBlockForm } from '@Apps/Events/EventsForm/EventsDateBlockForm';
import { EventsDateForm } from '@Apps/Events/EventsForm/EventsDateForm';
import { EventsPriceForm } from '@Apps/Events/EventsForm/EventsPriceForm';
import { EventsList, eventsListCrud } from '@Apps/Events/EventsList/EventsList';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';

import eventsReducer from './redux/events/eventsSlice';
import eventsApi from './services/api/eventsApi';

import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

export const initConstant = () => {
    setConstant('EVENTS_BASE_PATH', '/admin/evenements');
};

export const initComponent = () => {
    setComponent('CreateEvent', CreateEvent);
    setComponent('EditEvent', EditEvent);
    setComponent('DisplayEventMediaElement', DisplayEventMediaElement);
    setComponent('EditEventMediaModal', EditEventMediaModal);
    setComponent('EventMediaPartForm', EventMediaPartForm);
    setComponent('MoveEventMedias', MoveEventMedias);
    setComponent('DeleteEventMedias', DeleteEventMedias);
    setComponent('EventDateRange', EventDateRange);
    setComponent('EventParentCategoryPartForm', EventParentCategoryPartForm);
    setComponent('EventsPriceBlockForm', EventsPriceBlockForm);
    setComponent('EventsDateBlockForm', EventsDateBlockForm);
    setComponent('EventsDateForm', EventsDateForm);
    setComponent('EventsPriceForm', EventsPriceForm);
    setComponent('EventsList', EventsList);
};

export const initApi = () => {
    setApi('eventsApi', eventsApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.EVENTS_BASE_PATH, Component.EventsList);
    setAuthenticatedRoute(Constant.EVENTS_BASE_PATH + Constant.CREATE_PATH, Component.CreateEvent);
    setAuthenticatedRoute(`${Constant.EVENTS_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditEvent);
};

export const initReducer = () => {
    setReducer('events', eventsReducer);
};

export default async function ({ parameters }) {
    const eventName = parameters?.find((el) => el.paramKey === 'core_default_events_type')?.paramValue || 'Evénements';

    insertSubMenu(1, 'PROGRAMMER', eventName, Constant.EVENTS_BASE_PATH, <ConfirmationNumberIcon />);

    const crud = {
        list: eventsListCrud({ eventName }),
        add: eventsCreateCrud({ eventName }),
        edit: eventsEditCrud({ eventName }),
    };

    setCrud('events', crud);
}
