import React from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { OrdersList, ordersListCrud } from '@Apps/Orders/OrdersList/OrdersList';
import { OrdersDetail, ordersDetailCrud } from '@Apps/Orders/OrdersDetail/OrdersDetail';
import { CartOrderPart } from '@Apps/Orders/OrdersDetail/OrdersDetailParts/CartOrderPart';
import { CustomerOrderPart } from '@Apps/Orders/OrdersDetail/OrdersDetailParts/CustomerOrderPart';
import { OrderPart } from '@Apps/Orders/OrdersDetail/OrdersDetailParts/OrderPart';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { addTabElements } from '@/AdminService/Tab';
import { setCrud } from '@/AdminService/Crud';

import ordersReducer from './redux/orders/ordersSlice';
import ordersApi from './services/api/ordersApi';

export const initConstant = () => {
    setConstant('ORDERS_BASE_PATH', '/admin/commandes');
};

export const initComponent = () => {
    setComponent('OrdersList', OrdersList);
    setComponent('OrdersDetail', OrdersDetail);
    setComponent('CartOrderPart', CartOrderPart);
    setComponent('CustomerOrderPart', CustomerOrderPart);
    setComponent('OrderPart', OrderPart);
};

export const initApi = () => {
    setApi('ordersApi', ordersApi);
};

export const initReducer = () => {
    setReducer('orders', ordersReducer);
};

export const initCrud = () => {
    const crud = {
        list: ordersListCrud,
        detail: ordersDetailCrud,
    };

    setCrud('orders', crud);
};

export default async function ({ parameters }) {
    const useProducts = parameters?.find((el) => el.paramKey === 'core_use_purchase');

    if (useProducts?.paramValue) {
        addTabElements('ordersTabList', [{ label: 'Commandes', component: <Component.OrdersList />, path: Constant.ORDERS_BASE_PATH }]);

        setAuthenticatedRoute(Constant.ORDERS_BASE_PATH, Component.CmtAppMenu, {
            tabListName: 'ordersTabList',
            path: Constant.ORDERS_BASE_PATH,
        });
        setAuthenticatedRoute(`${Constant.ORDERS_BASE_PATH}/:id`, Component.OrdersDetail);

        insertSubMenu(1, 'VENDRE', 'Commandes', Constant.ORDERS_BASE_PATH, <ShoppingCartIcon />);
    }
}
