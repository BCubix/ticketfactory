import React from 'react';

import { EventTypesList, eventTypesListCrud } from '@Apps/EventTypes/EventTypesList/EventTypesList';
import eventTypesReducer from '@Apps/EventTypes/redux/eventTypes/eventTypesSlice';
import eventTypesApi from '@Apps/EventTypes/services/api/eventTypesApi';

import { setReducer } from '@/AdminService/Reducer';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';
import { addTabElements } from '@/AdminService/Tab';

export const initConstant = () => {
    setConstant('EVENT_TYPES_BASE_PATH', '/admin/types-d-evenements');
};

export const initComponent = () => {
    setComponent('EventTypesList', EventTypesList);
};

export const initApi = () => {
    setApi('eventTypesApi', eventTypesApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.EVENT_TYPES_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'seasonsTabList',
        path: Constant.EVENT_TYPES_BASE_PATH,
    });
    //setAuthenticatedRoute(Constant.EVENT_TYPES_BASE_PATH + Constant.CREATE_PATH, <></>);
    //setAuthenticatedRoute(`${Constant.EVENT_TYPES_BASE_PATH}/:id${Constant.EDIT_PATH}`, <></>);
};

export const initReducer = () => {
    setReducer('eventTypes', eventTypesReducer);
};

export const initTab = () => {
    addTabElements('seasonsTabList', [{ label: 'Types', component: <Component.EventTypesList />, path: Constant.EVENT_TYPES_BASE_PATH }]);
};

export const initCrud = () => {
    const crud = {
        list: eventTypesListCrud,
    };

    setCrud('eventTypes', crud);
};
