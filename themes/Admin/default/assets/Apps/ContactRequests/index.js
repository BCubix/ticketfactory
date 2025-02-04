import React from 'react';

import { ContactRequestsList, contactRequestsListCrud } from '@Apps/ContactRequests/ContactRequestsList/ContactRequestsList';
import { CreateContactRequests, contactRequestsCreateCrud } from '@Apps/ContactRequests/CreateContactRequest/CreateContactRequest';
import { EditContactRequest, contactRequestsEditCrud } from '@Apps/ContactRequests/EditContactRequest/EditContactRequest';
import EmailIcon from '@mui/icons-material/Email';

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
import { checkUserAccess } from '@Services/utils/checkUserAccess';

const ROLE_READ = 'ROLE_CONTACT_REQUEST_READ';
const ROLE_CREATE = 'ROLE_CONTACT_REQUEST_CREATE';
const ROLE_EDIT = 'ROLE_CONTACT_REQUEST_EDIT';

export const initConstant = () => {
    setConstant('CONTACT_REQUEST_BASE_PATH', '/admin/demandes-de-contact');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setComponent('ContactRequestsList', ContactRequestsList);
    setComponent('CreateContactRequests', CreateContactRequests);
    setComponent('EditContactRequest', EditContactRequest);
};

export const initApi = () => {
    setApi('contactRequestsApi', contactRequestsApi);
};

export const initAuthenticatedRoutes = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setAuthenticatedRoute(Constant.CONTACT_REQUEST_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'contactsTabList',
        tabPathValue: Constant.CONTACT_REQUEST_BASE_PATH,
    });

    if (checkUserAccess(userRoles, ROLE_CREATE)) {
        setAuthenticatedRoute(Constant.CONTACT_REQUEST_BASE_PATH + Constant.CREATE_PATH, Component.CreateContactRequests);
    }

    if (checkUserAccess(userRoles, ROLE_EDIT)) {
        setAuthenticatedRoute(`${Constant.CONTACT_REQUEST_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditContactRequest);
    }
};

export const initMenu = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    insertSubMenu(1, 'ADMINISTRER', 'Contacts', Constant.CONTACT_REQUEST_BASE_PATH, <EmailIcon />);
};

export const initReducer = () => {
    setReducer('contactRequests', contactRequestsReducer);
};

export const initTab = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    addTabElements('contactsTabList', [{ label: 'Demandes de contact', component: <Component.ContactRequestsList />, path: Constant.CONTACT_REQUEST_BASE_PATH }]);
};

export const initCrud = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    const crud = {
        list: contactRequestsListCrud,
        add: contactRequestsCreateCrud,
        edit: contactRequestsEditCrud,
    };

    setCrud('contactRequests', crud);
};
