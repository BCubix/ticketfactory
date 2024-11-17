import React from 'react';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

import { UploadModule } from '@Apps/Modules/UploadModule/UploadModule';
import { ModulesList } from '@Apps/Modules/ModulesList/ModulesList';
import modulesApi from './services/api/modulesApi';
import modulesReducer from './redux/modules/modulesSlice';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { addTabElements } from '@/AdminService/Tab';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

export const initConstant = () => {
    setConstant('MODULES_BASE_PATH', '/admin/modules');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_MODULE_READ')) {
        return;
    }

    setComponent('UploadModule', UploadModule);
    setComponent('ModulesList', ModulesList);
};

export const initApi = () => {
    setApi('modulesApi', modulesApi);
};

export const initAuthenticatedRoutes = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_MODULE_READ')) {
        return;
    }

    setAuthenticatedRoute(Constant.MODULES_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'modulesTabList',
        tabPathValue: Constant.MODULES_BASE_PATH,
    });
};

export const initMenu = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_MODULE_READ')) {
        return;
    }

    insertSubMenu(5, 'PERSONNALISER', 'Modules', Constant.MODULES_BASE_PATH, <ViewModuleIcon />, { relatedLinks: [Constant.HOOKS_BASE_PATH] });
};

export const initTab = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_MODULE_READ')) {
        return;
    }

    addTabElements('modulesTabList', [{ label: 'Modules', component: <Component.ModulesList />, path: Constant.MODULES_BASE_PATH }]);
};

export const initReducer = () => {
    setReducer('modules', modulesReducer);
};
