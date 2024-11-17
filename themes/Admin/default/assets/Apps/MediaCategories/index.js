import React from 'react';

import { CreateMediaCategory, mediaCategoriesCreateCrud } from '@Apps/MediaCategories/CreateMediaCategory/CreateMediaCategory';
import { EditMediaCategory, mediaCategoriesEditCrud } from '@Apps/MediaCategories/EditMediaCategory/EditMediaCategory';
import { ParentMediaCategoryPartForm } from '@Apps/MediaCategories/MediaCategoriesForm/ParentMediaCategoryPartForm';
import { MediaCategoriesList, mediaCategoriesListCrud } from '@Apps/MediaCategories/MediaCategoriesList/MediaCategoriesList';
import mediaCategoriesReducer from '@Apps/MediaCategories/redux/mediaCategories/mediaCategoriesSlice';
import mediaCategoriesApi from './services/api/mediaCategoriesApi';

import { setReducer } from '@/AdminService/Reducer';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';
import { addTabElements } from '@/AdminService/Tab';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

export const initConstant = () => {
    setConstant('MEDIA_CATEGORIES_BASE_PATH', '/admin/categories-de-media');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_MEDIA_CATEGORY_READ')) {
        return;
    }

    setComponent('CreateMediaCategory', CreateMediaCategory);
    setComponent('EditMediaCategory', EditMediaCategory);
    setComponent('ParentMediaCategoryPartForm', ParentMediaCategoryPartForm);
    setComponent('MediaCategoriesList', MediaCategoriesList);
};

export const initApi = () => {
    setApi('mediaCategoriesApi', mediaCategoriesApi);
};

export const initAuthenticatedRoutes = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_MEDIA_CATEGORY_READ')) {
        return;
    }

    setAuthenticatedRoute(Constant.MEDIA_CATEGORIES_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'mediasTabList',
        tabPathValue: Constant.MEDIA_CATEGORIES_BASE_PATH,
    });
    setAuthenticatedRoute(`${Constant.MEDIA_CATEGORIES_BASE_PATH}/:id`, Component.CmtAppMenu, {
        tabListName: 'mediasTabList',
        tabPathValue: Constant.MEDIA_CATEGORIES_BASE_PATH,
    });
    setAuthenticatedRoute(Constant.MEDIA_CATEGORIES_BASE_PATH + Constant.CREATE_PATH, Component.CreateMediaCategory);
    setAuthenticatedRoute(`${Constant.MEDIA_CATEGORIES_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditMediaCategory);
};

export const initReducer = () => {
    setReducer('mediaCategories', mediaCategoriesReducer);
};

export const initTab = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_MEDIA_CATEGORY_READ')) {
        return;
    }

    addTabElements('mediasTabList', [{ label: 'Catégories de média', component: <Component.MediaCategoriesList />, path: Constant.MEDIA_CATEGORIES_BASE_PATH }], 2);
};

export const initCrud = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_MEDIA_CATEGORY_READ')) {
        return;
    }

    const crud = {
        list: mediaCategoriesListCrud,
        add: mediaCategoriesCreateCrud,
        edit: mediaCategoriesEditCrud,
    };

    setCrud('mediaCategories', crud);
};
