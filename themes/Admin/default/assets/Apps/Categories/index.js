import React from 'react';

import { CategoriesForm } from '@Apps/Categories/CategoriesForm/CategoriesForm';
import { ParentCategoryPartForm } from '@Apps/Categories/CategoriesForm/ParentCategoryPartForm';
import { CategoriesList } from '@Apps/Categories/CategoriesList/CategoriesList';
import { EditCategoryLink } from '@Apps/Categories/CategoriesList/sc.EditCategoryLink';
import { CategoriesMenu } from '@Apps/Categories/CategoriesMenu/CategoriesMenu';
import { CreateCategory } from '@Apps/Categories/CreateCategory/CreateCategory';
import { EditCategory } from '@Apps/Categories/EditCategory/EditCategory';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';

import categoriesReducer from './redux/categories/categoriesSlice';
import categoriesApi from './services/api/categoriesApi';

import CategoryIcon from '@mui/icons-material/Category';

export const initConstant = () => {
    setConstant('CATEGORIES_BASE_PATH', '/admin/categories');
};

export const initComponent = () => {
    setComponent('CategoriesForm', CategoriesForm);
    setComponent('ParentCategoryPartForm', ParentCategoryPartForm);
    setComponent('CategoriesList', CategoriesList);
    setComponent('EditCategoryLink', EditCategoryLink);
    setComponent('CategoriesMenu', CategoriesMenu);
    setComponent('CreateCategory', CreateCategory);
    setComponent('EditCategory', EditCategory);
};

export const initApi = () => {
    setApi('categoriesApi', categoriesApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.CATEGORIES_BASE_PATH, Component.CategoriesMenu, { tabValue: 0 });
    setAuthenticatedRoute(`${Constant.CATEGORIES_BASE_PATH}/:id`, Component.CategoriesMenu, { tabValue: 0 });
    setAuthenticatedRoute(Constant.CATEGORIES_BASE_PATH + Constant.CREATE_PATH, Component.CreateCategory);
    setAuthenticatedRoute(`${Constant.CATEGORIES_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditCategory);
};

export const initMenu = () => {
    insertSubMenu(2, 'PROGRAMMER', 'Catégories', Constant.CATEGORIES_BASE_PATH, <CategoryIcon />, { relatedLinks: [Constant.TAGS_BASE_PATH] });
};

export const initReducer = () => {
    setReducer('categories', categoriesReducer);
};
