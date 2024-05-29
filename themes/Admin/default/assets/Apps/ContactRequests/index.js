import React from 'react';

import { ContactRequestsList, contactRequestsListCrud } from '@Apps/ContactRequests/ContactRequestsList/ContactRequestsList';
import { CreateContactRequests, contactRequestsCreateCrud } from '@Apps/ContactRequests/CreateContactRequest/CreateContactRequest';
import { EditContactRequest, contactRequestsEditCrud } from '@Apps/ContactRequests/EditContactRequest/EditContactRequest';

import contactRequestsApi from './services/api/contactRequestsApi';
import contactRequestsReducer from '@Apps/ContactRequests/redux/contactRequests/contactRequestsSlice';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';
import { addTabElements } from '@/AdminService/Tab';

import EmailIcon from '@mui/icons-material/Email';

export const initConstant = () => {
    setConstant('CONTACT_REQUEST_BASE_PATH', '/admin/demandes-de-contact');
};

export const initComponent = () => {
    setComponent('ContactRequestsList', ContactRequestsList);
    setComponent('CreateContactRequests', CreateContactRequests);
    setComponent('EditContactRequest', EditContactRequest);
};

export const initApi = () => {
    setApi('contactRequestsApi', contactRequestsApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.CONTACT_REQUEST_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'contactsTabList',
        tabPathValue: Constant.CONTACT_REQUEST_BASE_PATH,
    });
    setAuthenticatedRoute(Constant.CONTACT_REQUEST_BASE_PATH + Constant.CREATE_PATH, Component.CreateContactRequests);
    setAuthenticatedRoute(`${Constant.CONTACT_REQUEST_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditContactRequest);
};

export const initMenu = () => {
    insertSubMenu(1, 'ADMINISTRER', 'Contacts', Constant.CONTACT_REQUEST_BASE_PATH, <EmailIcon />);
};

export const initReducer = () => {
    setReducer('contactRequests', contactRequestsReducer);
};

export const initTab = () => {
    addTabElements('contactsTabList', [{ label: 'Demandes de contact', component: <Component.ContactRequestsList />, path: Constant.CONTACT_REQUEST_BASE_PATH }]);
};

export const initCrud = () => {
    const crud = {
        list: contactRequestsListCrud,
        add: contactRequestsCreateCrud,
        edit: contactRequestsEditCrud,
    };

    setCrud('contactRequests', crud);
};
