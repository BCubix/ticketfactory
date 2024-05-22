import React from 'react';

import { CreateRoom, roomsCreateCrud } from '@Apps/Rooms/CreateRoom/CreateRoom';
import { EditRoom, roomsEditCrud } from '@Apps/Rooms/EditRoom/EditRoom';
import { RoomsList, roomsListCrud } from '@Apps/Rooms/RoomsList/RoomsList';
import roomsReducer from '@Apps/Rooms/redux/rooms/roomsSlice';
import roomsApi from '@Apps/Rooms/services/api/roomsApi';

import { setReducer } from '@/AdminService/Reducer';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';
import { addTabElements } from '@/AdminService/Tab';

export const initConstant = () => {
    setConstant('ROOMS_BASE_PATH', '/admin/salles');
};

export const initComponent = () => {
    setComponent('CreateRoom', CreateRoom);
    setComponent('EditRoom', EditRoom);
    setComponent('RoomsList', RoomsList);
};

export const initApi = () => {
    setApi('roomsApi', roomsApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.ROOMS_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'seasonsTabList',
        path: Constant.ROOMS_BASE_PATH,
    });
    setAuthenticatedRoute(Constant.ROOMS_BASE_PATH + Constant.CREATE_PATH, Component.CreateRoom);
    setAuthenticatedRoute(`${Constant.ROOMS_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditRoom);
};

export const initReducer = () => {
    setReducer('rooms', roomsReducer);
};

export const initTab = () => {
    addTabElements('seasonsTabList', [{ label: 'Salles', component: <Component.RoomsList />, path: Constant.ROOMS_BASE_PATH }], 3);
};

export const initCrud = () => {
    const crud = {
        list: roomsListCrud,
        add: roomsCreateCrud,
        edit: roomsEditCrud,
    };

    setCrud('rooms', crud);
};
