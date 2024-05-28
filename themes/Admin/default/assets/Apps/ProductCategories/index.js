import { ProductCategoriesList } from '@Apps/ProductCategories/ProductCategoriesList/ProductCategoriesList';
import { ParentProductCategoryPartForm } from '@Apps/ProductCategories/ProductCategoriesForm/ParentProductCategoryPartForm';
import { EditProductCategory, productCategoriesEditCrud } from '@Apps/ProductCategories/EditProductCategory/EditProductCategory';
import { CreateProductCategory, productCategoriesCreateCrud } from '@Apps/ProductCategories/CreateProductCategory/CreateProductCategory';

import { setReducer } from '@/AdminService/Reducer';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';

import productCategoriesReducer from './redux/productCategories/productCategoriesSlice';
import productCategoriesApi from './services/api/productCategoriesApi';
import { productCategoriesListCrud } from './ProductCategoriesList/ProductCategoriesList';

export const initConstant = () => {
    setConstant('PRODUCT_CATEGORIES_BASE_PATH', '/admin/categories-de-produits');
};

export const initComponent = () => {
    setComponent('ProductCategoriesList', ProductCategoriesList);
    setComponent('ParentProductCategoryPartForm', ParentProductCategoryPartForm);
    setComponent('CreateProductCategory', CreateProductCategory);
    setComponent('EditProductCategory', EditProductCategory);
};

export const initApi = () => {
    setApi('productCategoriesApi', productCategoriesApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.PRODUCT_CATEGORIES_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'productsTabList',
        path: Constant.PRODUCT_CATEGORIES_BASE_PATH,
    });
    setAuthenticatedRoute(`${Constant.PRODUCT_CATEGORIES_BASE_PATH}/:id`, Component.CmtAppMenu, {
        tabListName: 'productsTabList',
        path: Constant.PRODUCT_CATEGORIES_BASE_PATH,
    });
    setAuthenticatedRoute(Constant.PRODUCT_CATEGORIES_BASE_PATH + Constant.CREATE_PATH, Component.CreateProductCategory);
    setAuthenticatedRoute(`${Constant.PRODUCT_CATEGORIES_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditProductCategory);
};

export const initReducer = () => {
    setReducer('productCategories', productCategoriesReducer);
};

export const initCrud = () => {
    const crud = {
        list: productCategoriesListCrud,
        add: productCategoriesCreateCrud,
        edit: productCategoriesEditCrud,
    };

    setCrud('productCategories', crud);
};
