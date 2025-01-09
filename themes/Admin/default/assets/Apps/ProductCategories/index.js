import { ProductCategoriesList } from '@Apps/ProductCategories/ProductCategoriesList/ProductCategoriesList';
import { ParentProductCategoryPartForm } from '@Apps/ProductCategories/ProductCategoriesForm/ParentProductCategoryPartForm';
import { EditProductCategory, productCategoriesEditCrud } from '@Apps/ProductCategories/EditProductCategory/EditProductCategory';
import { CreateProductCategory, productCategoriesCreateCrud } from '@Apps/ProductCategories/CreateProductCategory/CreateProductCategory';
import productCategoriesReducer from './redux/productCategories/productCategoriesSlice';
import productCategoriesApi from './services/api/productCategoriesApi';
import { productCategoriesListCrud } from './ProductCategoriesList/ProductCategoriesList';

import { setReducer } from '@/AdminService/Reducer';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

const ROLE_READ = 'ROLE_PRODUCT_CATEGORY_READ';
const ROLE_CREATE = 'ROLE_PRODUCT_CATEGORY_CREATE';
const ROLE_EDIT = 'ROLE_PRODUCT_CATEGORY_EDIT';

export const initConstant = () => {
    setConstant('PRODUCT_CATEGORIES_BASE_PATH', '/admin/categories-de-produits');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setComponent('ProductCategoriesList', ProductCategoriesList);
    setComponent('ParentProductCategoryPartForm', ParentProductCategoryPartForm);
    setComponent('CreateProductCategory', CreateProductCategory);
    setComponent('EditProductCategory', EditProductCategory);
};

export const initApi = () => {
    setApi('productCategoriesApi', productCategoriesApi);
};

export const initAuthenticatedRoutes = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setAuthenticatedRoute(Constant.PRODUCT_CATEGORIES_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'productsTabList',
        tabPathValue: Constant.PRODUCT_CATEGORIES_BASE_PATH,
    });
    setAuthenticatedRoute(`${Constant.PRODUCT_CATEGORIES_BASE_PATH}/:id`, Component.CmtAppMenu, {
        tabListName: 'productsTabList',
        tabPathValue: Constant.PRODUCT_CATEGORIES_BASE_PATH,
    });

    if (checkUserAccess(userRoles, ROLE_CREATE)) {
        setAuthenticatedRoute(Constant.PRODUCT_CATEGORIES_BASE_PATH + Constant.CREATE_PATH, Component.CreateProductCategory);
    }

    if (checkUserAccess(userRoles, ROLE_EDIT)) {
        setAuthenticatedRoute(`${Constant.PRODUCT_CATEGORIES_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditProductCategory);
    }
};

export const initReducer = () => {
    setReducer('productCategories', productCategoriesReducer);
};

export const initCrud = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    const crud = {
        list: productCategoriesListCrud,
        add: productCategoriesCreateCrud,
        edit: productCategoriesEditCrud,
    };

    setCrud('productCategories', crud);
};
