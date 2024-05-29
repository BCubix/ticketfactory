import React from 'react';

import { LanguagesList, languagesListCrud } from '@Apps/Languages/LanguagesList/LanguagesList';
import { CreateLanguage, languagesCreateCrud } from '@Apps/Languages/CreateLanguage/CreateLanguage';
import { EditLanguage, languagesEditCrud } from '@Apps/Languages/EditLanguage/EditLanguage';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { addTabElements } from '@/AdminService/Tab';

import languagesReducer from '@Apps/Languages/redux/languages/languagesSlice';
import languagesApi from './services/api/languagesApi';

import LanguageIcon from '@mui/icons-material/Language';
import { setCrud } from '@/AdminService/Crud';

export const initConstant = () => {
    setConstant('LANGUAGES_BASE_PATH', '/admin/langues');
};

export const initComponent = () => {
    setComponent('LanguagesList', LanguagesList);
    setComponent('CreateLanguage', CreateLanguage);
    setComponent('EditLanguage', EditLanguage);
};

export const initApi = () => {
    setApi('languagesApi', languagesApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.LANGUAGES_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'languagesTabList',
        tabPathValue: Constant.LANGUAGES_BASE_PATH,
    });
    setAuthenticatedRoute(Constant.LANGUAGES_BASE_PATH + Constant.CREATE_PATH, Component.CreateLanguage);
    setAuthenticatedRoute(`${Constant.LANGUAGES_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditLanguage);
};

export const initMenu = () => {
    insertSubMenu(3, 'PARAMETRER', 'Internationalisation', Constant.LANGUAGES_BASE_PATH, <LanguageIcon />);
};

export const initReducer = () => {
    setReducer('languages', languagesReducer);
};

export const initTab = () => {
    addTabElements('languagesTabList', [{ label: 'Langues', component: <Component.LanguagesList />, path: Constant.LANGUAGES_BASE_PATH }]);
};

export const initCrud = () => {
    const crud = {
        list: languagesListCrud,
        add: languagesCreateCrud,
        edit: languagesEditCrud,
    };

    setCrud('languages', crud);
};
