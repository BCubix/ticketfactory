import React from 'react';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

import ticketingApi from '@Apps/Ticketing/services/api/ticketingApi';
import ticketingReducer from '@Apps/Ticketing/redux/ticketing/ticketingSlice';
import { TicketingList } from '@Apps/Ticketing/TicketingList/TicketingList';
import { ticketingListCrud } from '@Apps/Ticketing/TicketingList/TicketingList';

import { setApi } from '@/AdminService/Api';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { Component, setComponent } from '@/AdminService/Component';
import { Constant, setConstant } from '@/AdminService/Constant';
import { setCrud } from '@/AdminService/Crud';
import { insertSubMenu } from '@/AdminService/Menu';
import { setReducer } from '@/AdminService/Reducer';

export const initConstant = () => {
    setConstant('TICKETING_BASE_PATH', '/admin/billetteries');
};

export const initComponent = () => {
    setComponent('TicketingList', TicketingList);
};

export const initApi = () => {
    setApi('ticketingApi', ticketingApi);
};

export const initReducer = () => {
    setReducer('ticketing', ticketingReducer);
};

export const initMenu = () => {
    insertSubMenu(3, 'ADMINISTRER', 'Billetteries', Constant.TICKETING_BASE_PATH, <ConfirmationNumberIcon />);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.TICKETING_BASE_PATH, Component.TicketingList);
};

export const initCrud = () => {
    const crud = {
        list: ticketingListCrud,
    };

    setCrud('ticketing', crud);
};
