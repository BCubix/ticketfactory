import React from 'react';
import HistoryIcon from '@mui/icons-material/History';

import { LogsList, LogTags, LogUserName, logsListCrud } from '@Apps/Logs/LogsList/LogsList';
import logsApi from './services/api/logsApi';

import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';
import { addTabElements } from '@/AdminService/Tab';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

export const initConstant = () => {
    setConstant('LOGS_BASE_PATH', '/admin/logs');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_LOG_READ')) {
        return;
    }

    setComponent('LogUserName', LogUserName);
    setComponent('LogTags', LogTags);
    setComponent('LogsList', LogsList);
};

export const initApi = () => {
    setApi('logsApi', logsApi);
};

export const initAuthenticatedRoutes = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_LOG_READ')) {
        return;
    }

    setAuthenticatedRoute(Constant.LOGS_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'logsTabList',
        tabPathValue: Constant.LOGS_BASE_PATH,
    });
};

export const initMenu = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_LOG_READ')) {
        return;
    }

    insertSubMenu(6, 'ADMINISTRER', 'Logs', Constant.LOGS_BASE_PATH, <HistoryIcon />);
};

export const initTab = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_LOG_READ')) {
        return;
    }

    addTabElements('logsTabList', [{ label: 'Logs', component: <Component.LogsList />, path: Constant.LOGS_BASE_PATH }]);
};

export const initCrud = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_LOG_READ')) {
        return;
    }

    const crud = {
        list: logsListCrud,
    };

    setCrud('logs', crud);
};
