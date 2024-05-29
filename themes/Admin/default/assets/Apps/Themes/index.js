import React from 'react';

import { UploadTheme } from '@Apps/Themes/UploadTheme/UploadTheme';
import { ThemesList } from '@Apps/Themes/ThemesList/ThemesList';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { addTabElements } from '@/AdminService/Tab';

import themesReducer from '@Apps/Themes/redux/themes/themesSlice';
import themesApi from '@Apps/Themes/services/api/themesApi';

import TvIcon from '@mui/icons-material/Tv';

export const initConstant = () => {
    setConstant('THEMES_BASE_PATH', '/admin/themes');
};

export const initComponent = () => {
    setComponent('UploadTheme', UploadTheme);
    setComponent('ThemesList', ThemesList);
};

export const initApi = () => {
    setApi('themesApi', themesApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.THEMES_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'themesTabList',
        tabPathValue: Constant.THEMES_BASE_PATH,
    });
};

export const initMenu = () => {
    insertSubMenu(6, 'PERSONNALISER', 'Thèmes', Constant.THEMES_BASE_PATH, <TvIcon />);
};

export const initTab = () => {
    addTabElements('themesTabList', [{ label: 'Thèmes', component: <Component.ThemesList />, path: Constant.THEMES_BASE_PATH }]);
};

export const initReducer = () => {
    setReducer('themes', themesReducer);
};
