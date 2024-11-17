import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';

import { DisplayTranslatedParameters } from '@Apps/Parameters/ParametersForm/DisplayTranslatedParameters';
import { ParametersBlockForm } from '@Apps/Parameters/ParametersForm/ParametersBlockForm';
import { parametersFormCrud, ParametersForm } from '@Apps/Parameters/ParametersForm/ParametersForm';
import { ParametersMenu } from '@Apps/Parameters/ParametersMenu/ParametersMenu';
import { ParametersModuleMenu } from '@Apps/Parameters/ParametersMenu/ParametersModuleMenu';
import { ParametersThemeMenu } from '@Apps/Parameters/ParametersMenu/ParametersThemeMenu';
import parametersReducer from '@Apps/Parameters/redux/parameters/parametersSlice';
import parametersApi from '@Apps/Parameters/services/api/parametersApi';

import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setCrud } from '@/AdminService/Crud';
import { insertSubMenu } from '@/AdminService/Menu';
import { setReducer } from '@/AdminService/Reducer';
import { addTabElements } from '@/AdminService/Tab';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

export const initConstant = () => {
    setConstant('PARAMETERS_BASE_PATH', '/admin/parametres');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_PARAMETER_READ')) {
        return;
    }

    setComponent('ParametersBlockForm', ParametersBlockForm);
    setComponent('ParametersForm', ParametersForm);
    setComponent('ParametersMenu', ParametersMenu);
    setComponent('ParametersModuleMenu', ParametersModuleMenu);
    setComponent('ParametersThemeMenu', ParametersThemeMenu);
    setComponent('DisplayTranslatedParameters', DisplayTranslatedParameters);
};

export const initApi = () => {
    setApi('parametersApi', parametersApi);
};

export const initAuthenticatedRoutes = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_PARAMETER_READ')) {
        return;
    }

    setAuthenticatedRoute(`${Constant.PARAMETERS_BASE_PATH}/modules/:id`, Component.ParametersModuleMenu);
    setAuthenticatedRoute(`${Constant.PARAMETERS_BASE_PATH}/themes/:id`, Component.ParametersThemeMenu);
    setAuthenticatedRoute(Constant.PARAMETERS_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'parametersTabList',
        tabPathValue: Constant.PARAMETERS_BASE_PATH,
    });
};

export const initMenu = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_PARAMETER_READ')) {
        return;
    }

    insertSubMenu(1, 'PARAMETRER', 'Paramètres', Constant.PARAMETERS_BASE_PATH, <SettingsIcon />);
};

export const initReducer = () => {
    setReducer('parameters', parametersReducer);
};

export const initTab = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_PARAMETER_READ')) {
        return;
    }

    addTabElements('parametersTabList', [{ label: 'Paramètres', component: <Component.ParametersMenu />, path: Constant.PARAMETERS_BASE_PATH }]);
};

export const initCrud = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_PARAMETER_READ')) {
        return;
    }

    const crud = {
        edit: parametersFormCrud,
    };

    setCrud('parameters', crud);
};
