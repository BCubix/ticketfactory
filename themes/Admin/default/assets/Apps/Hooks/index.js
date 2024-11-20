import React from 'react';

import { CreateHook } from '@Apps/Hooks/CreateHook/CreateHook';
import { HooksForm } from '@Apps/Hooks/HooksForm/HooksForm';
import { HookTable } from '@Apps/Hooks/HooksList/HookTable/HookTable';
import { HookTableBody } from '@Apps/Hooks/HooksList/HookTable/HookTableBody';
import { HookTableBodyRow } from '@Apps/Hooks/HooksList/HookTable/HookTableBodyRow';
import { HooksList } from '@Apps/Hooks/HooksList/HooksList';
import hooksReducer from './redux/hooks/hooksSlice';
import hooksApi from './services/api/hooksApi';

import { setReducer } from '@/AdminService/Reducer';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { addTabElements } from '@/AdminService/Tab';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

const ROLE_READ = 'ROLE_HOOK_READ';
const ROLE_CREATE = 'ROLE_HOOK_CREATE';

export const initConstant = () => {
    setConstant('HOOKS_BASE_PATH', '/admin/hooks');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setComponent('CreateHook', CreateHook);
    setComponent('HooksForm', HooksForm);
    setComponent('HookTable', HookTable);
    setComponent('HookTableBody', HookTableBody);
    setComponent('HookTableBodyRow', HookTableBodyRow);
    setComponent('HooksList', HooksList);
};

export const initApi = () => {
    setApi('hooksApi', hooksApi);
};

export const initAuthenticatedRoutes = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setAuthenticatedRoute(Constant.HOOKS_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'modulesTabList',
        tabPathValue: Constant.HOOKS_BASE_PATH,
    });

    if (checkUserAccess(userRoles, ROLE_CREATE)) {
        setAuthenticatedRoute(Constant.HOOKS_BASE_PATH + Constant.CREATE_PATH, Component.CreateHook);
    }
};

export const initTab = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    addTabElements('modulesTabList', [{ label: 'Hooks', component: <Component.HooksList />, path: Constant.HOOKS_BASE_PATH }]);
};

export const initReducer = () => {
    setReducer('hooks', hooksReducer);
};
