import React from 'react';

import { CreateRoom } from '@Apps/Rooms/CreateRoom/CreateRoom';
import { EditRoom } from '@Apps/Rooms/EditRoom/EditRoom';
import { RoomsForm } from '@Apps/Rooms/RoomsForm/RoomsForm';
import { RoomsMainPartForm } from '@Apps/Rooms/RoomsForm/RoomsMainPartForm';
import { RoomsSeatingPlanPartForm } from '@Apps/Rooms/RoomsForm/RoomsSeatingPlansPartForm';
import { RoomsFilters } from '@Apps/Rooms/RoomsList/RoomsFilters/RoomsFilters';
import { RoomsList } from '@Apps/Rooms/RoomsList/RoomsList';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';

import roomsReducer from '@Apps/Rooms/redux/rooms/roomsSlice';
import roomsApi from '@Apps/Rooms/services/api/roomsApi';

import BusinessIcon from '@mui/icons-material/Business';

export const initConstant = () => {
    setConstant('ROOMS_BASE_PATH', '/admin/salles');
};

export const initComponent = () => {
    setComponent('CreateRoom', CreateRoom);
    setComponent('EditRoom', EditRoom);
    setComponent('RoomsForm', RoomsForm);
    setComponent('RoomsMainPartForm', RoomsMainPartForm);
    setComponent('RoomsSeatingPlanPartForm', RoomsSeatingPlanPartForm);
    setComponent('RoomsFilters', RoomsFilters);
    setComponent('RoomsList', RoomsList);
};

export const initApi = () => {
    setApi('roomsApi', roomsApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.ROOMS_BASE_PATH, Component.RoomsList);
    setAuthenticatedRoute(Constant.ROOMS_BASE_PATH + Constant.CREATE_PATH, Component.CreateRoom);
    setAuthenticatedRoute(`${Constant.ROOMS_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditRoom);
};

export const initMenu = () => {
    insertSubMenu(2, 'PROGRAMMER', 'Salles', Constant.ROOMS_BASE_PATH, <BusinessIcon />);
};

export const initReducer = () => {
    setReducer('rooms', roomsReducer);
};
