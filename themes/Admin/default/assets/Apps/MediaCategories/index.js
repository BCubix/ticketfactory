import { CreateMediaCategory } from '@Apps/MediaCategories/CreateMediaCategory/CreateMediaCategory';
import { EditMediaCategory } from '@Apps/MediaCategories/EditMediaCategory/EditMediaCategory';
import { MediaCategoriesForm } from '@Apps/MediaCategories/MediaCategoriesForm/MediaCategoriesForm';
import { ParentMediaCategoryPartForm } from '@Apps/MediaCategories/MediaCategoriesForm/ParentMediaCategoryPartForm';
import { MediaCategoriesList } from '@Apps/MediaCategories/MediaCategoriesList/MediaCategoriesList';

import { setReducer } from '@/AdminService/Reducer';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';

import mediaCategoriesReducer from '@Apps/MediaCategories/redux/mediaCategories/mediaCategoriesSlice';
import mediaCategoriesApi from './services/api/mediaCategoriesApi';

export const initConstant = () => {
    setConstant('MEDIA_CATEGORIES_BASE_PATH', '/admin/categories-de-media');
};

export const initComponent = () => {
    setComponent('CreateMediaCategory', CreateMediaCategory);
    setComponent('EditMediaCategory', EditMediaCategory);
    setComponent('MediaCategoriesForm', MediaCategoriesForm);
    setComponent('ParentMediaCategoryPartForm', ParentMediaCategoryPartForm);
    setComponent('MediaCategoriesList', MediaCategoriesList);
};

export const initApi = () => {
    setApi('mediaCategoriesApi', mediaCategoriesApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.MEDIA_CATEGORIES_BASE_PATH, Component.MediasMenu, { tabValue: 1 });
    setAuthenticatedRoute(`${Constant.MEDIA_CATEGORIES_BASE_PATH}/:id`, Component.MediasMenu, { tabValue: 1 });
    setAuthenticatedRoute(Constant.MEDIA_CATEGORIES_BASE_PATH + Constant.CREATE_PATH, Component.CreateMediaCategory);
    setAuthenticatedRoute(`${Constant.MEDIA_CATEGORIES_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditMediaCategory);
};

export const initReducer = () => {
    setReducer('mediaCategories', mediaCategoriesReducer);
};
