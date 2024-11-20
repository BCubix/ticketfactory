import React from 'react';

import { EventTypesList, eventTypesListCrud } from '@Apps/EventTypes/EventTypesList/EventTypesList';
import { EditEventType, eventTypesEditCrud } from '@Apps/EventTypes/EditEventType/EditEventType';
import eventTypesReducer from '@Apps/EventTypes/redux/eventTypes/eventTypesSlice';
import eventTypesApi from '@Apps/EventTypes/services/api/eventTypesApi';

import { setReducer } from '@/AdminService/Reducer';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';
import { addTabElements } from '@/AdminService/Tab';
import { getSubMenu, setSubMenu } from '@/AdminService/Menu';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

const ROLE_READ = 'ROLE_EVENT_TYPE_READ';
const ROLE_EDIT = 'ROLE_EVENT_TYPE_EDIT';

export const initConstant = () => {
    setConstant('EVENT_TYPES_BASE_PATH', '/admin/types-d-evenements');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setComponent('EventTypesList', EventTypesList);
    setComponent('EditEventType', EditEventType);
};

export const initApi = () => {
    setApi('eventTypesApi', eventTypesApi);
};

export const initReducer = () => {
    setReducer('eventTypes', eventTypesReducer);
};

export const initCrud = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    const crud = {
        list: eventTypesListCrud,
        edit: eventTypesEditCrud,
    };

    setCrud('eventTypes', crud);
};

export default async function ({ parameters, userRoles }) {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    const useEventTypes = parameters?.find((el) => el.paramKey === 'core_use_event_types');
    if (!useEventTypes?.paramValue) {
        return;
    }

    setAuthenticatedRoute(Constant.EVENT_TYPES_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'seasonsTabList',
        tabPathValue: Constant.EVENT_TYPES_BASE_PATH,
    });

    if (checkUserAccess(userRoles, ROLE_EDIT)) {
        setAuthenticatedRoute(`${Constant.EVENT_TYPES_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditEventType);
    }

    addTabElements('seasonsTabList', [{ label: "Types d'évènements", component: <Component.EventTypesList />, path: Constant.EVENT_TYPES_BASE_PATH }], 3);

    let subMenu = getSubMenu('ADMINISTRER', 'Référentiels');
    if (!subMenu) {
        return;
    }

    setSubMenu(subMenu.position, 'ADMINISTRER', 'Référentiels', subMenu.link, subMenu.icon, {
        ...subMenu.options,
        linkList: [...(subMenu.linkList || []), { link: Constant.EVENT_TYPES_BASE_PATH, position: 3 }],
        relatedLinks: [...(subMenu.relatedLinks || []), Constant.EVENT_TYPES_BASE_PATH],
    });
}
