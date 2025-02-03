import React from 'react';
import FastfoodIcon from '@mui/icons-material/Fastfood';

import { ProductsList, productsListCrud } from '@Apps/Products/ProductsList/ProductsList';
import { ProductStockMovementList } from '@Apps/Products/ProductsList/ProductStockMovementList';
import { ProductsFilters } from '@Apps/Products/ProductsList/ProductsFilters/ProductsFilters';
import { EditProduct, productsEditCrud } from '@Apps/Products/EditProduct/EditProduct';
import { CreateProduct, productsCreateCrud } from '@Apps/Products/CreateProduct/CreateProduct';
import { ProductsMenu } from '@Apps/Products/ProductsMenu/ProductsMenu';
import { ProductMainPartForm } from '@Apps/Products/ProductsForm/ProductMainPartForm';
import { ProductParentCategoryPartForm } from '@Apps/Products/ProductsForm/ProductParentCategoryPartForm';
import { ProductMovementPartForm } from '@Apps/Products/ProductsForm/ProductMovementPartForm';
import productsReducer from '@Apps/Products/redux/products/productsSlice';
import productsApi from '@Apps/Products/services/api/productsApi';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';
import { setTab } from '@/AdminService/Tab';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

const ROLE_READ = 'ROLE_PRODUCT_READ';
const ROLE_CREATE = 'ROLE_PRODUCT_CREATE';
const ROLE_EDIT = 'ROLE_PRODUCT_EDIT';

export const initConstant = () => {
    setConstant('PRODUCTS_BASE_PATH', '/admin/produits');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setComponent('ProductsList', ProductsList);
    setComponent('ProductsFilters', ProductsFilters);
    setComponent('EditProduct', EditProduct);
    setComponent('CreateProduct', CreateProduct);
    setComponent('ProductsMenu', ProductsMenu);
    setComponent('ProductMainPartForm', ProductMainPartForm);
    setComponent('ProductParentCategoryPartForm', ProductParentCategoryPartForm);
    setComponent('ProductStockMovementList', ProductStockMovementList);
    setComponent('ProductMovementPartForm', ProductMovementPartForm);
};

export const initApi = () => {
    setApi('productsApi', productsApi);
};

export const initReducer = () => {
    setReducer('products', productsReducer);
};

export const initTab = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setTab('productsTabList', () => [
        { label: 'Produits', component: <Component.ProductsList />, path: Constant.PRODUCTS_BASE_PATH },
        { label: 'Catégories de produits', component: <Component.ProductCategoriesList />, path: Constant.PRODUCT_CATEGORIES_BASE_PATH },
    ]);
};

export const initCrud = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    const crud = {
        list: productsListCrud,
        add: productsCreateCrud,
        edit: productsEditCrud,
    };

    setCrud('products', crud);
};

export default async function ({ parameters, userRoles }) {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    const useProducts = parameters?.find((el) => el.paramKey === 'core_use_products');
    if (useProducts?.paramValue) {
        setAuthenticatedRoute(Constant.PRODUCTS_BASE_PATH, Component.CmtAppMenu, {
            tabListName: 'productsTabList',
            tabPathValue: Constant.PRODUCTS_BASE_PATH,
        });

        if (checkUserAccess(userRoles, ROLE_CREATE)) {
            setAuthenticatedRoute(Constant.PRODUCTS_BASE_PATH + Constant.CREATE_PATH, Component.CreateProduct);
        }

        if (checkUserAccess(userRoles, ROLE_EDIT)) {
            setAuthenticatedRoute(`${Constant.PRODUCTS_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditProduct);
        }

        insertSubMenu(3, 'PROGRAMMATION', 'Produits', Constant.PRODUCTS_BASE_PATH, <FastfoodIcon />, { relatedLinks: [Constant.PRODUCT_CATEGORIES_BASE_PATH] });
    }
}
