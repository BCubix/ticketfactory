import React from 'react';

import { UploadModule } from '@Apps/Modules/UploadModule/UploadModule';
import { ModulesList } from '@Apps/Modules/ModulesList/ModulesList';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { addTabElements } from '@/AdminService/Tab';

import modulesApi from './services/api/modulesApi';
import modulesReducer from './redux/modules/modulesSlice';

import ViewModuleIcon from '@mui/icons-material/ViewModule';

export const initConstant = () => {
    setConstant('MODULES_BASE_PATH', '/admin/modules');
};

export const initComponent = () => {
    setComponent('UploadModule', UploadModule);
    setComponent('ModulesList', ModulesList);
};

export const initApi = () => {
    setApi('modulesApi', modulesApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.MODULES_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'modulesTabList',
        tabPathValue: Constant.MODULES_BASE_PATH,
    });
};

export const initMenu = () => {
    insertSubMenu(5, 'PERSONNALISER', 'Modules', Constant.MODULES_BASE_PATH, <ViewModuleIcon />, { relatedLinks: [Constant.HOOKS_BASE_PATH] });
};

export const initTab = () => {
    addTabElements('modulesTabList', [{ label: 'Modules', component: <Component.ModulesList />, path: Constant.MODULES_BASE_PATH }]);
};

export const initReducer = () => {
    setReducer('modules', modulesReducer);
};
