import React from 'react';

import { LanguagesList } from '@Apps/Languages/LanguagesList/LanguagesList';
import { CreateLanguage } from '@Apps/Languages/CreateLanguage/CreateLanguage';
import { EditLanguage } from '@Apps/Languages/EditLanguage/EditLanguage';
import { LanguagesForm } from '@Apps/Languages/LanguagesForm/LanguagesForm';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';

import languagesReducer from '@Apps/Languages/redux/languages/languagesSlice';
import languagesApi from './services/api/languagesApi';

import LanguageIcon from '@mui/icons-material/Language';

export const initConstant = () => {
    setConstant('LANGUAGES_BASE_PATH', '/admin/langues');
};

export const initComponent = () => {
    setComponent('LanguagesList', LanguagesList);
    setComponent('CreateLanguage', CreateLanguage);
    setComponent('EditLanguage', EditLanguage);
    setComponent('LanguagesForm', LanguagesForm);
};

export const initApi = () => {
    setApi('languagesApi', languagesApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.LANGUAGES_BASE_PATH, Component.LanguagesList);
    setAuthenticatedRoute(Constant.LANGUAGES_BASE_PATH + Constant.CREATE_PATH, Component.CreateLanguage);
    setAuthenticatedRoute(`${Constant.LANGUAGES_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditLanguage);
};

export const initMenu = () => {
    insertSubMenu(1, 'ADMINISTRER', 'Langues', Constant.LANGUAGES_BASE_PATH, <LanguageIcon />);
};

export const initReducer = () => {
    setReducer('languages', languagesReducer);
};
