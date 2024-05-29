import React from 'react';

import { ParentCategoryPartForm } from '@Apps/Categories/CategoriesForm/ParentCategoryPartForm';
import { CategoriesList, categoriesListCrud } from '@Apps/Categories/CategoriesList/CategoriesList';
import { EditCategoryLink } from '@Apps/Categories/CategoriesList/sc.EditCategoryLink';
import { CreateCategory, categoriesCreateCrud } from '@Apps/Categories/CreateCategory/CreateCategory';
import { EditCategory, categoriesEditCrud } from '@Apps/Categories/EditCategory/EditCategory';

import { setReducer } from '@/AdminService/Reducer';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';
import { addTabElements } from '@/AdminService/Tab';

import categoriesReducer from './redux/categories/categoriesSlice';
import categoriesApi from './services/api/categoriesApi';

export const initConstant = () => {
    setConstant('CATEGORIES_BASE_PATH', '/admin/categories');
};

export const initComponent = () => {
    setComponent('ParentCategoryPartForm', ParentCategoryPartForm);
    setComponent('CategoriesList', CategoriesList);
    setComponent('EditCategoryLink', EditCategoryLink);
    setComponent('CreateCategory', CreateCategory);
    setComponent('EditCategory', EditCategory);
};

export const initApi = () => {
    setApi('categoriesApi', categoriesApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.CATEGORIES_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'eventTabList',
        tabPathValue: Constant.CATEGORIES_BASE_PATH,
    });
    setAuthenticatedRoute(`${Constant.CATEGORIES_BASE_PATH}/:id`, Component.CmtAppMenu, {
        tabListName: 'eventTabList',
        tabPathValue: Constant.CATEGORIES_BASE_PATH,
    });
    setAuthenticatedRoute(Constant.CATEGORIES_BASE_PATH + Constant.CREATE_PATH, Component.CreateCategory);
    setAuthenticatedRoute(`${Constant.CATEGORIES_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditCategory);
};

export const initReducer = () => {
    setReducer('categories', categoriesReducer);
};

export const initTab = () => {
    addTabElements('eventTabList', [{ label: 'Catégories', component: <Component.CategoriesList />, path: Constant.CATEGORIES_BASE_PATH }], 2);
};

export const initCrud = () => {
    const crud = {
        list: categoriesListCrud,
        add: categoriesCreateCrud,
        edit: categoriesEditCrud,
    };

    setCrud('categories', crud);
};
