import React from 'react';

import { ProductsList } from '@Apps/Products/ProductsList/ProductsList';
import { ProductsFilters } from '@Apps/Products/ProductsList/ProductsFilters/ProductsFilters';
import { ProductsForm } from '@Apps/Products/ProductsForm/ProductsForm';
import { EditProduct } from '@Apps/Products/EditProduct/EditProduct';
import { CreateProduct, productsCreateCrud } from '@Apps/Products/CreateProduct/CreateProduct';
import { ProductsMenu } from '@Apps/Products/ProductsMenu/ProductsMenu';
import { ProductMainPartForm } from '@Apps/Products/ProductsForm/ProductMainPartForm';
import { ProductMediaPartForm } from '@Apps/Products/ProductsForm/ProductMediaPartForm';
import { ProductParentCategoryPartForm } from '@Apps/Products/ProductsForm/ProductParentCategoryPartForm';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';
import { setTab } from '@/AdminService/Tab';

import productsReducer from '@Apps/Products/redux/products/productsSlice';
import productsApi from '@Apps/Products/services/api/productsApi';

import FastfoodIcon from '@mui/icons-material/Fastfood';
import { productsListCrud } from './ProductsList/ProductsList';

export const initConstant = () => {
    setConstant('PRODUCTS_BASE_PATH', '/admin/produits');
};

export const initComponent = () => {
    setComponent('ProductsList', ProductsList);
    setComponent('ProductsFilters', ProductsFilters);
    setComponent('ProductsForm', ProductsForm);
    setComponent('EditProduct', EditProduct);
    setComponent('CreateProduct', CreateProduct);
    setComponent('ProductsMenu', ProductsMenu);
    setComponent('ProductMainPartForm', ProductMainPartForm);
    setComponent('ProductMediaPartForm', ProductMediaPartForm);
    setComponent('ProductParentCategoryPartForm', ProductParentCategoryPartForm);
};

export const initApi = () => {
    setApi('productsApi', productsApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.PRODUCTS_BASE_PATH, Component.ProductsMenu, { tabValue: 0 });
    setAuthenticatedRoute(Constant.PRODUCTS_BASE_PATH + Constant.CREATE_PATH, Component.CreateProduct);
    setAuthenticatedRoute(`${Constant.PRODUCTS_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditProduct);
};

export const initMenu = () => {
    insertSubMenu(1, 'VENDRE', 'Produits', Constant.PRODUCTS_BASE_PATH, <FastfoodIcon />, { relatedLinks: [Constant.PRODUCT_CATEGORIES_BASE_PATH] });
};

export const initReducer = () => {
    setReducer('products', productsReducer);
};

export const initTab = () => {
    setTab('ProductsTabList', () => [
        { label: 'Produits', component: <Component.ProductsList />, path: Constant.PRODUCTS_BASE_PATH },
        { label: 'Catégories de produits', component: <Component.ProductCategoriesList />, path: Constant.PRODUCT_CATEGORIES_BASE_PATH },
    ]);

    setTab('ProductsFormTabList', (props) => [
        {
            label: 'Produit',
            id: 'productPartButton',
            component: <Component.ProductMainPartForm {...props} />,
        },
        {
            label: 'Médias',
            id: 'mediasPartButton',
            component: <Component.CmtMediaPartForm {...props} name="productMedias" />,
        },
    ]);
};

export const initCrud = () => {
    const crud = {
        list: productsListCrud,
        add: productsCreateCrud,
    };

    setCrud('products', crud);
};
