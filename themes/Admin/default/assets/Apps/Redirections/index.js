import React from 'react';

import { CreateRedirection, redirectionsCreateCrud } from '@Apps/Redirections/CreateRedirection/CreateRedirection';
import { EditRedirection, redirectionsEditCrud } from '@Apps/Redirections/EditRedirection/EditRedirection';
import { RedirectionsList, redirectionsListCrud } from '@Apps/Redirections/RedirectionsList/RedirectionsList';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';

import redirectionsReducer from '@Apps/Redirections/redux/redirections/redirectionsSlice';
import redirectionsApi from '@Apps/Redirections/services/api/redirectionsApi';

import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';

export const initConstant = () => {
    setConstant('REDIRECTIONS_BASE_PATH', '/admin/redirections');
};

export const initComponent = () => {
    setComponent('CreateRedirection', CreateRedirection);
    setComponent('EditRedirection', EditRedirection);
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
    //insertSubMenu(5, 'PERSONNALISER', 'Redirections', Constant.REDIRECTIONS_BASE_PATH, <CallMissedOutgoingIcon />);
};

export const initReducer = () => {
    setReducer('redirections', redirectionsReducer);
};

export const initCrud = () => {
    const crud = {
        list: redirectionsListCrud,
        add: redirectionsCreateCrud,
        edit: redirectionsEditCrud,
    };

    setCrud('redirections', crud);
};
