import React from 'react';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

import ticketingApi from '@Apps/Ticketing/services/api/ticketingApi';
import ticketingReducer from '@Apps/Ticketing/redux/ticketing/ticketingSlice';
import { TicketingList, ticketingListCrud } from '@Apps/Ticketing/TicketingList/TicketingList';
import { CreateTicketing, ticketingCreateCrud } from '@Apps/Ticketing/CreateTicketing/CreateTicketing';
import { EditTicketing, ticketingEditCrud } from '@Apps/Ticketing/EditTicketing/EditTicketing';

import { setApi } from '@/AdminService/Api';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { Component, setComponent } from '@/AdminService/Component';
import { Constant, setConstant } from '@/AdminService/Constant';
import { setCrud } from '@/AdminService/Crud';
import { insertSubMenu } from '@/AdminService/Menu';
import { setReducer } from '@/AdminService/Reducer';
import { TicketingForm } from './TicketingForm/TicketingForm';
import { TicketingModulePartForm } from './TicketingForm/TicketingModulePartForm';

export const initConstant = () => {
    setConstant('TICKETING_BASE_PATH', '/admin/billetteries');
};

export const initComponent = () => {
    setComponent('TicketingList', TicketingList);
    setComponent('CreateTicketing', CreateTicketing);
    setComponent('EditTicketing', EditTicketing);
    setComponent('TicketingForm', TicketingForm);
    setComponent('TicketingModulePartForm', TicketingModulePartForm);
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
    setAuthenticatedRoute(Constant.TICKETING_BASE_PATH + Constant.CREATE_PATH, Component.CreateTicketing);
    setAuthenticatedRoute(`${Constant.TICKETING_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditTicketing);
};

export const initCrud = () => {
    const crud = {
        list: ticketingListCrud,
        add: { ...ticketingCreateCrud },
        edit: { ...ticketingEditCrud },
    };

    setCrud('ticketing', { ...crud });
};
