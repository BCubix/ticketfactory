import React from 'react';

import { ParametersBlockForm } from '@Apps/Parameters/ParametersForm/ParametersBlockForm';
import { ParametersForm } from '@Apps/Parameters/ParametersForm/ParametersForm';
import { ParametersMenu } from '@Apps/Parameters/ParametersMenu/ParametersMenu';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';

import parametersReducer from '@Apps/Parameters/redux/parameters/parametersSlice';
import parametersApi from '@Apps/Parameters/services/api/parametersApi';

import SettingsIcon from '@mui/icons-material/Settings';

export const initConstant = () => {
    setConstant('PARAMETERS_BASE_PATH', '/admin/parametres');
};

export const initComponent = () => {
    setComponent('ParametersBlockForm', ParametersBlockForm);
    setComponent('ParametersForm', ParametersForm);
    setComponent('ParametersMenu', ParametersMenu);
};

export const initApi = () => {
    setApi('parametersApi', parametersApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.PARAMETERS_BASE_PATH, Component.ParametersMenu);
};

export const initMenu = () => {
    insertSubMenu(2, 'ADMINISTRER', 'Paramètres', Constant.PARAMETERS_BASE_PATH, <SettingsIcon />);
};

export const initReducer = () => {
    setReducer('parameters', parametersReducer);
};
