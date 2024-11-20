import React from 'react';

import { EditOrderStatus } from '@Apps/OrderStatus/EditOrderStatus/EditOrderStatus';
import { OrderStatusList } from '@Apps/OrderStatus/OrderStatusList/OrderStatusList';
import orderStatusApi from '@Apps/OrderStatus/services/api/orderStatusApi';
import orderStatusReducer from '@Apps/OrderStatus/redux/orderStatus/orderStatusSlice';
import { orderStatusListCrud } from './OrderStatusList/OrderStatusList';
import { orderStatusEditCrud } from './EditOrderStatus/EditOrderStatus';

import { setReducer } from '@/AdminService/Reducer';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { addTabElements } from '@/AdminService/Tab';
import { setCrud } from '@/AdminService/Crud';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

const ROLE_READ = 'ROLE_ORDER_STATUS_READ';
const ROLE_EDIT = 'ROLE_ORDER_STATUS_EDIT';

export const initConstant = () => {
    setConstant('ORDER_STATUS_BASE_PATH', '/admin/etapes-de-commandes');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setComponent('EditOrderStatus', EditOrderStatus);
    setComponent('OrderStatusList', OrderStatusList);
};

export const initApi = () => {
    setApi('orderStatusApi', orderStatusApi);
};

export const initAuthenticatedRoutes = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setAuthenticatedRoute(Constant.ORDER_STATUS_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'ordersTabList',
        tabPathValue: Constant.ORDER_STATUS_BASE_PATH,
    });

    if (checkUserAccess(userRoles, ROLE_EDIT)) {
        setAuthenticatedRoute(`${Constant.ORDER_STATUS_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditOrderStatus);
    }
};

export const initReducer = () => {
    setReducer('orderStatus', orderStatusReducer);
};

export const initTab = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    addTabElements('ordersTabList', [{ label: 'Etapes de commandes', component: <Component.OrderStatusList />, path: Constant.ORDER_STATUS_BASE_PATH }], 3);
};

export const initCrud = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    const crud = {
        list: orderStatusListCrud,
        edit: orderStatusEditCrud,
    };

    setCrud('orderStatus', crud);
};
