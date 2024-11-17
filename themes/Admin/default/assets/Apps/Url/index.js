import React from 'react';
import HttpIcon from '@mui/icons-material/Http';

import { UrlList, urlListCrud } from './UrlsList/UrlsList';
import { EditUrl, urlEditCrud } from './EditUrl/EditUrl';
import { UrlParameters } from './UrlParameters/UrlParameters';
import urlApi from './service/api/urlApi';
import urlReducer from '@Apps/Url/redux/url/urlSlice';

import { setReducer } from '@/AdminService/Reducer';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';
import { addTabElements } from '@/AdminService/Tab';
import { insertSubMenu } from '@/AdminService/Menu';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

export const initConstant = () => {
    setConstant('URL_BASE_PATH', '/admin/urls');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_URL_READ')) {
        return;
    }

    setComponent('UrlList', UrlList);
    setComponent('EditUrl', EditUrl);
    setComponent('UrlParameters', UrlParameters);
};

export const initApi = () => {
    setApi('urlApi', urlApi);
};

export const initMenu = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_URL_READ')) {
        return;
    }

    insertSubMenu(2, 'PARAMETRER', 'URL', Constant.URL_BASE_PATH, <HttpIcon />, {});
};

export const initReducer = () => {
    setReducer('url', urlReducer);
};

export const initAuthenticatedRoutes = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_URL_READ')) {
        return;
    }

    setAuthenticatedRoute(Constant.URL_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'urlTabList',
        tabPathValue: Constant.URL_BASE_PATH,
    });
    setAuthenticatedRoute(`${Constant.URL_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditUrl);
};

export const initTab = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_URL_READ')) {
        return;
    }

    addTabElements('urlTabList', [{ label: 'URL', component: <Component.UrlList />, path: Constant.URL_BASE_PATH }], 1);
};

export const initCrud = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_URL_READ')) {
        return;
    }

    const crud = {
        list: urlListCrud,
        edit: urlEditCrud,
    };

    setCrud('url', crud);
};
