import React from 'react';

import { CreateHook } from '@Apps/Hooks/CreateHook/CreateHook';
import { HooksForm } from '@Apps/Hooks/HooksForm/HooksForm';
import { HookTable } from '@Apps/Hooks/HooksList/HookTable/HookTable';
import { HookTableBody } from '@Apps/Hooks/HooksList/HookTable/HookTableBody';
import { HookTableBodyRow } from '@Apps/Hooks/HooksList/HookTable/HookTableBodyRow';
import { HooksList } from '@Apps/Hooks/HooksList/HooksList';

import { setReducer } from '@/AdminService/Reducer';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';

import hooksReducer from './redux/hooks/hooksSlice';
import hooksApi from './services/api/hooksApi';

export const initConstant = () => {
    setConstant('HOOKS_BASE_PATH', '/admin/hooks');
};

export const initComponent = () => {
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

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.HOOKS_BASE_PATH, Component.ModulesMenu, { tabValue: 1 });
    setAuthenticatedRoute(Constant.HOOKS_BASE_PATH + Constant.CREATE_PATH, Component.CreateHook);
};

export const initReducer = () => {
    setReducer('hooks', hooksReducer);
};
