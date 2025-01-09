import React from 'react';

import { ParentCategoryPartForm } from '@Apps/Categories/CategoriesForm/ParentCategoryPartForm';
import { CategoriesList, categoriesListCrud } from '@Apps/Categories/CategoriesList/CategoriesList';
import { EditCategoryLink } from '@Apps/Categories/CategoriesList/sc.EditCategoryLink';
import { CreateCategory, categoriesCreateCrud } from '@Apps/Categories/CreateCategory/CreateCategory';
import { EditCategory, categoriesEditCrud } from '@Apps/Categories/EditCategory/EditCategory';
import categoriesReducer from './redux/categories/categoriesSlice';
import categoriesApi from './services/api/categoriesApi';

import { setReducer } from '@/AdminService/Reducer';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';
import { addTabElements } from '@/AdminService/Tab';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

const ROLE_READ = 'ROLE_EVENT_CATEGORY_READ';
const ROLE_CREATE = 'ROLE_EVENT_CATEGORY_CREATE';
const ROLE_EDIT = 'ROLE_EVENT_CATEGORY_EDIT';

export const initConstant = () => {
    setConstant('CATEGORIES_BASE_PATH', '/admin/categories');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setComponent('ParentCategoryPartForm', ParentCategoryPartForm);
    setComponent('CategoriesList', CategoriesList);
    setComponent('EditCategoryLink', EditCategoryLink);
    setComponent('CreateCategory', CreateCategory);
    setComponent('EditCategory', EditCategory);
};

export const initApi = () => {
    setApi('categoriesApi', categoriesApi);
};

export const initAuthenticatedRoutes = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setAuthenticatedRoute(Constant.CATEGORIES_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'eventTabList',
        tabPathValue: Constant.CATEGORIES_BASE_PATH,
    });
    setAuthenticatedRoute(`${Constant.CATEGORIES_BASE_PATH}/:id`, Component.CmtAppMenu, {
        tabListName: 'eventTabList',
        tabPathValue: Constant.CATEGORIES_BASE_PATH,
    });

    if (checkUserAccess(userRoles, ROLE_CREATE)) {
        setAuthenticatedRoute(Constant.CATEGORIES_BASE_PATH + Constant.CREATE_PATH, Component.CreateCategory);
    }

    if (checkUserAccess(userRoles, ROLE_EDIT)) {
        setAuthenticatedRoute(`${Constant.CATEGORIES_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditCategory);
    }
};

export const initReducer = () => {
    setReducer('categories', categoriesReducer);
};

export const initTab = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    addTabElements('eventTabList', [{ label: 'Catégories', component: <Component.CategoriesList />, path: Constant.CATEGORIES_BASE_PATH }], 2);
};

export const initCrud = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    const crud = {
        list: categoriesListCrud,
        add: categoriesCreateCrud,
        edit: categoriesEditCrud,
    };

    setCrud('categories', crud);
};
