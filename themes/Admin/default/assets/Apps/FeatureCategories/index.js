import React from 'react';
import BusinessIcon from '@mui/icons-material/Business';

import { FeatureCategoriesList } from '@Apps/FeatureCategories/FeatureCategoriesList/FeatureCategoriesList';
import featureCategoriesApi from '@Apps/FeatureCategories/services/api/featureCategoriesApi';
import featureCategoriesReducer from '@Apps/FeatureCategories/redux/featureCategories/featureCategoriesSlice';
import { featureCategoriesListCrud } from '@Apps/FeatureCategories/FeatureCategoriesList/FeatureCategoriesList';
import { CreateFeatureCategory } from '@Apps/FeatureCategories/CreateFeatureCategory/CreateFeatureCategory';
import { featureCategoriesCreateCrud } from '@Apps/FeatureCategories/CreateFeatureCategory/CreateFeatureCategory';
import { EditFeatureCategory } from '@Apps/FeatureCategories/EditFeatureCategory/EditFeatureCategory';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';
import { featureCategoriesEditCrud } from './EditFeatureCategory/EditFeatureCategory';

export const initConstant = () => {
    setConstant('FEATURE_CATEGORIES_BASE_PATH', '/admin/categories-des-attributs');
};

export const initComponent = () => {
    setComponent('FeatureCategoriesList', FeatureCategoriesList);
    setComponent('CreateFeatureCategory', CreateFeatureCategory);
    setComponent('EditFeatureCategory', EditFeatureCategory);
};

export const initApi = () => {
    setApi('featureCategoriesApi', featureCategoriesApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.FEATURE_CATEGORIES_BASE_PATH, Component.FeatureCategoriesList);
    setAuthenticatedRoute(Constant.FEATURE_CATEGORIES_BASE_PATH + Constant.CREATE_PATH, Component.CreateFeatureCategory);
    setAuthenticatedRoute(`${Constant.FEATURE_CATEGORIES_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditFeatureCategory);
};

export const initMenu = () => {
    insertSubMenu(5, 'PROGRAMMER', "Catégories d'attributs", Constant.FEATURE_CATEGORIES_BASE_PATH, <BusinessIcon />);
};

export const initReducer = () => {
    setReducer('featureCategories', featureCategoriesReducer);
};

export const initCrud = () => {
    const crud = {
        list: featureCategoriesListCrud,
        add: featureCategoriesCreateCrud,
        edit: featureCategoriesEditCrud,
    };

    setCrud('featureCategories', crud);
};
