import React from 'react';

import { CreateRedirection } from '@Apps/Redirections/CreateRedirection/CreateRedirection';
import { EditRedirection } from '@Apps/Redirections/EditRedirection/EditRedirection';
import { RedirectionsForm } from '@Apps/Redirections/RedirectionsForm/RedirectionsForm';
import { RedirectionsFilters } from '@Apps/Redirections/RedirectionsList/RedirectionsFilters/RedirectionsFilters';
import { RedirectionsList } from '@Apps/Redirections/RedirectionsList/RedirectionsList';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';

import redirectionsReducer from '@Apps/Redirections/redux/redirections/redirectionsSlice';
import redirectionsApi from '@Apps/Redirections/services/api/redirectionsApi';

import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';

export const initConstant = () => {
    setConstant('REDIRECTIONS_BASE_PATH', '/admin/redirections');
};

export const initComponent = () => {
    setComponent('CreateRedirection', CreateRedirection);
    setComponent('EditRedirection', EditRedirection);
    setComponent('RedirectionsForm', RedirectionsForm);
    setComponent('RedirectionsFilters', RedirectionsFilters);
    setComponent('RedirectionsList', RedirectionsList);
};

export const initApi = () => {
    setApi('redirectionsApi', redirectionsApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.REDIRECTIONS_BASE_PATH, Component.RedirectionsList);
    setAuthenticatedRoute(Constant.REDIRECTIONS_BASE_PATH + Constant.CREATE_PATH, Component.CreateRedirection);
    setAuthenticatedRoute(`${Constant.REDIRECTIONS_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditRedirection);
};

export const initMenu = () => {
    insertSubMenu(2, 'PERSONNALISER', 'Redirections', Constant.REDIRECTIONS_BASE_PATH, <CallMissedOutgoingIcon />);
};

export const initReducer = () => {
    setReducer('redirections', redirectionsReducer);
};
