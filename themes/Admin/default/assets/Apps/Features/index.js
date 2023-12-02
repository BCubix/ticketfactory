import React from 'react';
import BusinessIcon from '@mui/icons-material/Business';

import { CreateFeatureCategory, featureCategoriesCreateCrud } from '@Apps/FeatureCategories/CreateFeatureCategory/CreateFeatureCategory';
import { EditFeatureCategory, featureCategoriesEditCrud } from '@Apps/FeatureCategories/EditFeatureCategory/EditFeatureCategory';
import { FeaturesList, featuresListCrud } from '@Apps/Features/FeaturesList/FeaturesList';
import { CreateFeature, featuresCreateCrud } from '@Apps/Features/CreateFeature/CreateFeature';
import { FeatureCategoriesList, featureCategoriesListCrud } from '@Apps/FeatureCategories/FeatureCategoriesList/FeatureCategoriesList';
import featureCategoriesReducer from '@Apps/FeatureCategories/redux/featureCategories/featureCategoriesSlice';
import featureCategoriesApi from '@Apps/FeatureCategories/services/api/featureCategoriesApi';

import { setApi } from '@/AdminService/Api';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { Component, setComponent } from '@/AdminService/Component';
import { Constant, setConstant } from '@/AdminService/Constant';
import { setCrud } from '@/AdminService/Crud';
import { insertSubMenu } from '@/AdminService/Menu';
import { setReducer } from '@/AdminService/Reducer';
import featuresApi from './services/api/featuresApi';
import featuresReducer from './redux/features/featuresSlice';

export const initConstant = () => {
    setConstant('FEATURES_BASE_PATH', '/admin/attributs');
};

export const initComponent = () => {
    setComponent('FeaturesList', FeaturesList);
    setComponent('CreateFeature', CreateFeature);
    setComponent('EditFeature', EditFeatureCategory);
};

export const initApi = () => {
    setApi('featuresApi', featuresApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.FEATURES_BASE_PATH, Component.FeaturesList);
    setAuthenticatedRoute(Constant.FEATURES_BASE_PATH + Constant.CREATE_PATH, Component.CreateFeature);
    setAuthenticatedRoute(`${Constant.FEATURES_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditFeature);
};

export const initMenu = () => {
    insertSubMenu(5, 'PROGRAMMER', 'Attributs', Constant.FEATURES_BASE_PATH, <BusinessIcon />);
};

export const initReducer = () => {
    setReducer('features', featuresReducer);
};

export const initCrud = () => {
    const crud = {
        list: featuresListCrud,
        add: featuresCreateCrud,
        edit: featureCategoriesEditCrud,
    };

    setCrud('features', crud);
};
