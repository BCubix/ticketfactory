import React from 'react';

import { setReducer } from '@/AdminService/Reducer';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { addTabElements } from '@/AdminService/Tab';
import { setCrud } from '@/AdminService/Crud';

import { EditOrderStatus } from '@Apps/OrderStatus/EditOrderStatus/EditOrderStatus';
import { OrderStatusList } from '@Apps/OrderStatus/OrderStatusList/OrderStatusList';
import orderStatusApi from '@Apps/OrderStatus/services/api/orderStatusApi';
import orderStatusReducer from '@Apps/OrderStatus/redux/orderStatus/orderStatusSlice';
import { orderStatusListCrud } from './OrderStatusList/OrderStatusList';
import { orderStatusEditCrud } from './EditOrderStatus/EditOrderStatus';

export const initConstant = () => {
    setConstant('ORDER_STATUS_BASE_PATH', '/admin/etapes-de-commandes');
};

export const initComponent = () => {
    setComponent('EditOrderStatus', EditOrderStatus);
    setComponent('OrderStatusList', OrderStatusList);
};

export const initApi = () => {
    setApi('orderStatusApi', orderStatusApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.ORDER_STATUS_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'ordersTabList',
        path: Constant.ORDER_STATUS_BASE_PATH,
    });
    setAuthenticatedRoute(`${Constant.ORDER_STATUS_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditOrderStatus);
};

export const initReducer = () => {
    setReducer('orderStatus', orderStatusReducer);
};

export const initTab = () => {
    addTabElements('ordersTabList', [{ label: 'Etapes de commandes', component: <Component.OrderStatusList />, path: Constant.ORDER_STATUS_BASE_PATH }], 3);
};

export const initCrud = () => {
    const crud = {
        list: orderStatusListCrud,
        edit: orderStatusEditCrud,
    };

    setCrud('orderStatus', crud);
};
