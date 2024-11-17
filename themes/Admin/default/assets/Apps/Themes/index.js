import React from 'react';
import TvIcon from '@mui/icons-material/Tv';

import { UploadTheme } from '@Apps/Themes/UploadTheme/UploadTheme';
import { ThemesList } from '@Apps/Themes/ThemesList/ThemesList';
import themesReducer from '@Apps/Themes/redux/themes/themesSlice';
import themesApi from '@Apps/Themes/services/api/themesApi';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { addTabElements } from '@/AdminService/Tab';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

export const initConstant = () => {
    setConstant('THEMES_BASE_PATH', '/admin/themes');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_THEME_READ')) {
        return;
    }

    setComponent('UploadTheme', UploadTheme);
    setComponent('ThemesList', ThemesList);
};

export const initApi = () => {
    setApi('themesApi', themesApi);
};

export const initAuthenticatedRoutes = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_THEME_READ')) {
        return;
    }

    setAuthenticatedRoute(Constant.THEMES_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'themesTabList',
        tabPathValue: Constant.THEMES_BASE_PATH,
    });
};

export const initMenu = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_THEME_READ')) {
        return;
    }

    insertSubMenu(6, 'PERSONNALISER', 'Thèmes', Constant.THEMES_BASE_PATH, <TvIcon />);
};

export const initTab = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_THEME_READ')) {
        return;
    }

    addTabElements('themesTabList', [{ label: 'Thèmes', component: <Component.ThemesList />, path: Constant.THEMES_BASE_PATH }]);
};

export const initReducer = () => {
    setReducer('themes', themesReducer);
};
