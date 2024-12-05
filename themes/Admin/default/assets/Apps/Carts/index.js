import React from 'react';

import { CartsList, cartsListCrud } from '@Apps/Carts/CartsList/CartsList';
import { CartsDetail, cartsDetailCrud } from '@Apps/Carts/CartsDetail/CartsDetail';
import { CustomerCartPart } from '@Apps/Carts/CartsDetail/CartsDetailParts/CustomerCartPart';
import { CartPart } from '@Apps/Carts/CartsDetail/CartsDetailParts/CartPart';
import { CartEventPart } from '@Apps/Carts/CartsDetail/CartsDetailParts/CartEventPart';
import { CartProductPart } from '@Apps/Carts/CartsDetail/CartsDetailParts/CartProductPart';
import { CartSubscriptionPart } from '@Apps/Carts/CartsDetail/CartsDetailParts/CartSubscriptionPart';
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
import { checkUserAccess } from '@Services/utils/checkUserAccess';

export const initConstant = () => {
    setConstant('CARTS_BASE_PATH', '/admin/paniers');
};

export const initComponent = ({ userRoles }) => {
    setComponent('CartPart', CartPart);
    setComponent('CartEventPart', CartEventPart);
    setComponent('CartProductPart', CartProductPart);
    setComponent('CartSubscriptionPart', CartSubscriptionPart);

    if (!checkUserAccess(userRoles, 'ROLE_CART_READ')) {
        return;
    }

    setComponent('CartsList', CartsList);
    setComponent('CartsDetail', CartsDetail);
    setComponent('CustomerCartPart', CustomerCartPart);
    setComponent('OrderCartPart', OrderCartPart);
};

export const initApi = () => {
    setApi('cartsApi', cartsApi);
};

export const initReducer = () => {
    setReducer('carts', cartsReducer);
};

export const initCrud = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_CART_READ')) {
        return;
    }

    const crud = {
        list: cartsListCrud,
        detail: cartsDetailCrud,
    };

    setCrud('carts', crud);
};

export default async function ({ parameters, userRoles }) {
    if (!checkUserAccess(userRoles, 'ROLE_CART_READ')) {
        return;
    }

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
