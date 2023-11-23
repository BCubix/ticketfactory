import React from 'react';

import { ContactRequestsForm } from '@Apps/ContactRequests/ContactRequestsForm/ContactRequestsForm';
import { ContactRequestsFilters } from '@Apps/ContactRequests/ContactRequestsList/ContactRequestsFilters/ContactRequestsFilters';
import { ContactRequestsList } from '@Apps/ContactRequests/ContactRequestsList/ContactRequestsList';
import { CreateContactRequests } from '@Apps/ContactRequests/CreateContactRequest/CreateContactRequest';
import { EditContactRequest } from '@Apps/ContactRequests/EditContactRequest/EditContactRequest';

import contactRequestsApi from './services/api/contactRequestsApi';
import contactRequestsReducer from '@Apps/ContactRequests/redux/contactRequests/contactRequestsSlice';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';

import EmailIcon from '@mui/icons-material/Email';

export const initConstant = () => {
    setConstant('CONTACT_REQUEST_BASE_PATH', '/admin/demandes-de-contact');
};

export const initComponent = () => {
    setComponent('ContactRequestsForm', ContactRequestsForm);
    setComponent('ContactRequestsFilters', ContactRequestsFilters);
    setComponent('ContactRequestsList', ContactRequestsList);
    setComponent('CreateContactRequests', CreateContactRequests);
    setComponent('EditContactRequest', EditContactRequest);
};

export const initApi = () => {
    setApi('contactRequestsApi', contactRequestsApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.CONTACT_REQUEST_BASE_PATH, Component.ContactRequestsList);
    setAuthenticatedRoute(Constant.CONTACT_REQUEST_BASE_PATH + Constant.CREATE_PATH, Component.CreateContactRequests);
    setAuthenticatedRoute(`${Constant.CONTACT_REQUEST_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditContactRequest);
};

export const initMenu = () => {
    insertSubMenu(2, 'ADMINISTRER', 'Contacts', Constant.CONTACT_REQUEST_BASE_PATH, <EmailIcon />);
};

export const initReducer = () => {
    setReducer('contactRequests', contactRequestsReducer);
};
