import React from 'react';

import { LogsList, LogTags, LogUserName, logsListCrud } from '@Apps/Logs/LogsList/LogsList';

import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';

import logsApi from './services/api/logsApi';

import HistoryIcon from '@mui/icons-material/History';

export const initConstant = () => {
    setConstant('LOGS_BASE_PATH', '/admin/logs');
};

export const initComponent = () => {
    setComponent('LogUserName', LogUserName);
    setComponent('LogTags', LogTags);
    setComponent('LogsList', LogsList);
};

export const initApi = () => {
    setApi('logsApi', logsApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.LOGS_BASE_PATH, Component.LogsList);
};

export const initMenu = () => {
    insertSubMenu(6, 'ADMINISTRER', 'Logs', Constant.LOGS_BASE_PATH, <HistoryIcon />);
};

export const initCrud = () => {
    const crud = {
        list: logsListCrud,
    };

    setCrud('logs', crud);
};
