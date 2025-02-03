import React from 'react';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

import { CreateEvent, eventsCreateCrud } from '@Apps/Events/CreateEvent/CreateEvent';
import { EditEvent, eventsEditCrud } from '@Apps/Events/EditEvent/EditEvent';
import { DisplayEventMediaElement } from '@Apps/Events/EventsForm/EventMediaPart/DisplayEventMediaElement';
import { EditEventMediaModal } from '@Apps/Events/EventsForm/EventMediaPart/EditEventMediaModal';
import { EventMediaPartForm } from '@Apps/Events/EventsForm/EventMediaPart/EventMediaPartForm';
import { MoveEventMedias } from '@Apps/Events/EventsForm/EventMediaPart/MoveEventMedias';
import { DeleteEventMedias } from '@Apps/Events/EventsForm/EventMediaPart/DeleteEventMedias';
import { EventDateRange } from '@Apps/Events/EventsForm/EventDateRange';
import { EventParentCategoryPartForm } from '@Apps/Events/EventsForm/EventParentCategoryPartForm';
import { EventsPriceCategoryForm } from '@Apps/Events/EventsForm/EventPriceCategoryForm';
import { EventsDateForm } from '@Apps/Events/EventsForm/EventsDateForm';
import { EventsPriceForm } from '@Apps/Events/EventsForm/EventsPriceForm';
import { EventsList, eventsListCrud } from '@Apps/Events/EventsList/EventsList';
import { EventHistory } from '@Apps/Events/EventHistory/EventHistory';
import eventsReducer from '@Apps/Events/redux/events/eventsSlice';
import eventsApi from '@Apps/Events/services/api/eventsApi';
import eventHistoryApi from '@Apps/Events/services/api/eventHistoryApi';
import { CmtCalendarForm } from '@Apps/Events/EventsForm/CmtCalendar/CmtCalendarForm';
import { eventHistoryCrud } from './EventHistory/EventHistory';
import { DisplayEventHistoryBlock } from './EventHistory/DisplayEventHistoryBlock';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';
import { addTabElements } from '@/AdminService/Tab';
import { checkUserAccess } from '@Services/utils/checkUserAccess';
import { DisplayEventHistoryFields } from './EventHistory/DisplayEventHistoryFields';

const ROLE_READ = 'ROLE_EVENT_READ';
const ROLE_CREATE = 'ROLE_EVENT_CREATE';
const ROLE_EDIT = 'ROLE_EVENT_EDIT';

export const initConstant = () => {
    setConstant('EVENTS_BASE_PATH', '/admin/evenements');
    setConstant('EVENT_HISTORY_BASE_PATH', '/admin/historique-d-evenement');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setComponent('CreateEvent', CreateEvent);
    setComponent('EditEvent', EditEvent);
    setComponent('DisplayEventMediaElement', DisplayEventMediaElement);
    setComponent('EditEventMediaModal', EditEventMediaModal);
    setComponent('EventMediaPartForm', EventMediaPartForm);
    setComponent('MoveEventMedias', MoveEventMedias);
    setComponent('DeleteEventMedias', DeleteEventMedias);
    setComponent('EventDateRange', EventDateRange);
    setComponent('EventParentCategoryPartForm', EventParentCategoryPartForm);
    setComponent('EventsPriceCategoryForm', EventsPriceCategoryForm);
    setComponent('EventsDateForm', EventsDateForm);
    setComponent('EventsPriceForm', EventsPriceForm);
    setComponent('EventsList', EventsList);
    setComponent('EventHistory', EventHistory);
    setComponent('CmtCalendarForm', CmtCalendarForm);
    setComponent('DisplayEventHistoryBlock', DisplayEventHistoryBlock);
    setComponent('DisplayEventHistoryFields', DisplayEventHistoryFields);
};

export const initApi = () => {
    setApi('eventsApi', eventsApi);
    setApi('eventHistoryApi', eventHistoryApi);
};

export const initAuthenticatedRoutes = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setAuthenticatedRoute(Constant.EVENTS_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'eventTabList',
        tabPathValue: Constant.EVENTS_BASE_PATH,
    });

    if (checkUserAccess(userRoles, ROLE_CREATE)) {
        setAuthenticatedRoute(Constant.EVENTS_BASE_PATH + Constant.CREATE_PATH, Component.CreateEvent);
    }

    if (checkUserAccess(userRoles, ROLE_EDIT)) {
        setAuthenticatedRoute(`${Constant.EVENTS_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditEvent);
        setAuthenticatedRoute(`${Constant.EVENT_HISTORY_BASE_PATH}/:id`, Component.EventHistory);
    }
};

export const initReducer = () => {
    setReducer('events', eventsReducer);
};

export default async function ({ parameters, userRoles }) {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    const eventName = parameters?.find((el) => el.paramKey === 'core_default_events_type')?.paramValue || 'Evénements';
    insertSubMenu(1, 'PROGRAMMATION', eventName, Constant.EVENTS_BASE_PATH, <ConfirmationNumberIcon />, {
        relatedLinks: [Constant.CATEGORIES_BASE_PATH, Constant.TAGS_BASE_PATH],
    });

    addTabElements('eventTabList', [{ label: eventName, component: <Component.EventsList />, path: Constant.EVENTS_BASE_PATH }]);

    const crud = {
        list: eventsListCrud({ eventName }),
        add: eventsCreateCrud({ eventName }),
        edit: eventsEditCrud({ eventName }),
        history: eventHistoryCrud,
    };

    setCrud('events', crud);
}
