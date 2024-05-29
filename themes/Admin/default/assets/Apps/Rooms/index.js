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
import { getSubMenu, setSubMenu } from '@/AdminService/Menu';

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

export const initReducer = () => {
    setReducer('rooms', roomsReducer);
};

export const initCrud = () => {
    const crud = {
        list: roomsListCrud,
        add: roomsCreateCrud,
        edit: roomsEditCrud,
    };

    setCrud('rooms', crud);
};

export default async function ({ parameters }) {
    const useRooms = parameters?.find((el) => el.paramKey === 'core_use_rooms');

    if (!useRooms?.paramValue) {
        return;
    }

    setAuthenticatedRoute(Constant.ROOMS_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'seasonsTabList',
        tabPathValue: Constant.ROOMS_BASE_PATH,
    });
    setAuthenticatedRoute(Constant.ROOMS_BASE_PATH + Constant.CREATE_PATH, Component.CreateRoom);
    setAuthenticatedRoute(`${Constant.ROOMS_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditRoom);

    addTabElements('seasonsTabList', [{ label: 'Salles', component: <Component.RoomsList />, path: Constant.ROOMS_BASE_PATH }], 1);

    let subMenu = getSubMenu('ADMINISTRER', 'Référentiels');
    if (!subMenu) {
        return;
    }

    setSubMenu(subMenu.position, 'ADMINISTRER', 'Référentiels', subMenu.link, subMenu.icon, {
        ...subMenu.options,
        linkList: [...(subMenu.linkList || []), { link: Constant.ROOMS_BASE_PATH, position: 2 }],
        relatedLinks: [...(subMenu.relatedLinks || []), Constant.ROOMS_BASE_PATH],
    });
}
