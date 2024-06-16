import React from 'react';

import { CartsList, cartsListCrud } from '@Apps/Carts/CartsList/CartsList';
import { CartsDetail, cartsDetailCrud } from '@Apps/Carts/CartsDetail/CartsDetail';
import { CustomerCartPart } from '@Apps/Carts/CartsDetail/CartsDetailParts/CustomerCartPart';
import { CartPart } from '@Apps/Carts/CartsDetail/CartsDetailParts/CartPart';
import { OrderCartPart } from '@Apps/Carts/CartsDetail/CartsDetailParts/OrderCartPart';
import cartsApi from './services/api/cartsApi';
import cartsReducer from './redux/carts/cartsSlice';

import { setReducer } from '@/AdminService/Reducer';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setCrud } from '@/AdminService/Crud';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { addTabElements } from '@/AdminService/Tab';

export const initConstant = () => {
    setConstant('CARTS_BASE_PATH', '/admin/paniers');
};

export const initComponent = () => {
    setComponent('CartsList', CartsList);
    setComponent('CartsDetail', CartsDetail);
    setComponent('CustomerCartPart', CustomerCartPart);
    setComponent('CartPart', CartPart);
    setComponent('OrderCartPart', OrderCartPart);
};

export const initApi = () => {
    setApi('cartsApi', cartsApi);
};

export const initReducer = () => {
    setReducer('carts', cartsReducer);
};

export const initCrud = () => {
    const crud = {
        list: cartsListCrud,
        detail: cartsDetailCrud,
    };

    setCrud('carts', crud);
};

export default async function ({ parameters }) {
    const useProducts = parameters?.find((el) => el.paramKey === 'core_use_purchase');

    if (useProducts?.paramValue) {
        addTabElements('ordersTabList', [{ label: 'Panier', component: <Component.CartsList />, path: Constant.CARTS_BASE_PATH }], 2);

        setAuthenticatedRoute(Constant.CARTS_BASE_PATH, Component.CmtAppMenu, {
            tabListName: 'ordersTabList',
            tabPathValue: Constant.CARTS_BASE_PATH,
        });
        setAuthenticatedRoute(`${Constant.CARTS_BASE_PATH}/:id`, Component.CartsDetail);
    }
}
