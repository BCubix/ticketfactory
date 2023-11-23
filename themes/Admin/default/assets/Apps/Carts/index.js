import React from 'react';

import { CartsList } from '@Apps/Carts/CartsList/CartsList';
import { CartsFilters } from '@Apps/Carts/CartsList/CartsFilters/CartsFilters';
import { CartsDetail } from '@Apps/Carts/CartsDetail/CartsDetail';
import { CustomerCartPart } from '@Apps/Carts/CartsDetail/CartsDetailParts/CustomerCartPart';
import { CartPart } from '@Apps/Carts/CartsDetail/CartsDetailParts/CartPart';
import { OrderCartPart } from '@Apps/Carts/CartsDetail/CartsDetailParts/OrderCartPart';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';

import cartsApi from './services/api/cartsApi';
import cartsReducer from './redux/carts/cartsSlice';

import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

export const initConstant = () => {
    setConstant('CARTS_BASE_PATH', '/admin/paniers');
};

export const initComponent = () => {
    setComponent('CartsList', CartsList);
    setComponent('CartsFilters', CartsFilters);
    setComponent('CartsDetail', CartsDetail);
    setComponent('CustomerCartPart', CustomerCartPart);
    setComponent('CartPart', CartPart);
    setComponent('OrderCartPart', OrderCartPart);
};

export const initApi = () => {
    setApi('cartsApi', cartsApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.CARTS_BASE_PATH, Component.CartsList);
    setAuthenticatedRoute(`${Constant.CARTS_BASE_PATH}/:id`, Component.CartsDetail);
};

export const initMenu = () => {
    insertSubMenu(1, 'VENDRE', 'Panier', Constant.CARTS_BASE_PATH, <ShoppingBasketIcon />);
};

export const initReducer = () => {
    setReducer('carts', cartsReducer);
};
