import React from 'react';

import { ModulesMenu } from '@Apps/Modules/ModulesMenu/ModulesMenu';
import { UploadModule } from '@Apps/Modules/UploadModule/UploadModule';
import { ModulesList } from '@Apps/Modules/ModulesList/ModulesList';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';

import modulesApi from './services/api/modulesApi';
import modulesReducer from './redux/modules/modulesSlice';

import ViewModuleIcon from '@mui/icons-material/ViewModule';

export const initConstant = () => {
    setConstant('MODULES_BASE_PATH', '/admin/modules');
};

export const initComponent = () => {
    setComponent('UploadModule', UploadModule);
    setComponent('ModulesList', ModulesList);
    setComponent('ModulesMenu', ModulesMenu);
};

export const initApi = () => {
    setApi('modulesApi', modulesApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.MODULES_BASE_PATH, Component.ModulesMenu, { tabValue: 0 });
};

export const initMenu = () => {
    insertSubMenu(2, 'PERSONNALISER', 'Modules', Constant.MODULES_BASE_PATH, <ViewModuleIcon />, { relatedLinks: [Constant.HOOKS_BASE_PATH] });
};

export const initReducer = () => {
    setReducer('modules', modulesReducer);
};
