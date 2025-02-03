import React from 'react';
import LanguageIcon from '@mui/icons-material/Language';

import { LanguagesList, languagesListCrud } from '@Apps/Languages/LanguagesList/LanguagesList';
import { CreateLanguage, languagesCreateCrud } from '@Apps/Languages/CreateLanguage/CreateLanguage';
import { EditLanguage, languagesEditCrud } from '@Apps/Languages/EditLanguage/EditLanguage';
import languagesReducer from '@Apps/Languages/redux/languages/languagesSlice';
import languagesApi from './services/api/languagesApi';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { addTabElements } from '@/AdminService/Tab';
import { setCrud } from '@/AdminService/Crud';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

const ROLE_READ = 'ROLE_LANGUAGE_READ';
const ROLE_CREATE = 'ROLE_LANGUAGE_CREATE';
const ROLE_EDIT = 'ROLE_LANGUAGE_EDIT';

export const initConstant = () => {
    setConstant('LANGUAGES_BASE_PATH', '/admin/langues');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setComponent('LanguagesList', LanguagesList);
    setComponent('CreateLanguage', CreateLanguage);
    setComponent('EditLanguage', EditLanguage);
};

export const initApi = () => {
    setApi('languagesApi', languagesApi);
};

export const initAuthenticatedRoutes = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setAuthenticatedRoute(Constant.LANGUAGES_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'languagesTabList',
        tabPathValue: Constant.LANGUAGES_BASE_PATH,
    });

    if (checkUserAccess(userRoles, ROLE_CREATE)) {
        setAuthenticatedRoute(Constant.LANGUAGES_BASE_PATH + Constant.CREATE_PATH, Component.CreateLanguage);
    }

    if (checkUserAccess(userRoles, ROLE_EDIT)) {
        setAuthenticatedRoute(`${Constant.LANGUAGES_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditLanguage);
    }
};

export const initMenu = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    insertSubMenu(3, 'PARAMETRER', 'Internationalisation', Constant.LANGUAGES_BASE_PATH, <LanguageIcon />);
};

export const initReducer = () => {
    setReducer('languages', languagesReducer);
};

export const initTab = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    addTabElements('languagesTabList', [{ label: 'Langues', component: <Component.LanguagesList />, path: Constant.LANGUAGES_BASE_PATH }]);
};

export const initCrud = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    const crud = {
        list: languagesListCrud,
        add: languagesCreateCrud,
        edit: languagesEditCrud,
    };

    setCrud('languages', crud);
};
