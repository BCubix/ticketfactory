import React from 'react';
import BusinessIcon from '@mui/icons-material/Business';

import { CreateFeature, featuresCreateCrud } from '@Apps/Features/CreateFeature/CreateFeature';
import { EditFeature, featuresEditCrud } from '@Apps/Features/EditFeature/EditFeature';
import { FeaturesList, featuresListCrud } from '@Apps/Features/FeaturesList/FeaturesList';
import { FeaturesMenu } from '@Apps/Features/FeaturesMenu/FeaturesMenu';
import featuresApi from '@Apps/Features/services/api/featuresApi';
import featuresReducer from '@Apps/Features/redux/features/featuresSlice';

import { setApi } from '@/AdminService/Api';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { Component, setComponent } from '@/AdminService/Component';
import { Constant, setConstant } from '@/AdminService/Constant';
import { setCrud } from '@/AdminService/Crud';
import { insertSubMenu } from '@/AdminService/Menu';
import { setReducer } from '@/AdminService/Reducer';
import { setTab } from '@/AdminService/Tab';

export const initConstant = () => {
    setConstant('FEATURES_BASE_PATH', '/admin/attributs');
};

export const initComponent = () => {
    setComponent('FeaturesList', FeaturesList);
    setComponent('CreateFeature', CreateFeature);
    setComponent('EditFeature', EditFeature);
    setComponent('FeaturesMenu', FeaturesMenu);
};

export const initApi = () => {
    setApi('featuresApi', featuresApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.FEATURES_BASE_PATH, Component.FeaturesMenu, { tabValue: 0 });
    setAuthenticatedRoute(Constant.FEATURES_BASE_PATH + Constant.CREATE_PATH, Component.CreateFeature);
    setAuthenticatedRoute(`${Constant.FEATURES_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditFeature);
};

export const initMenu = () => {
    insertSubMenu(5, 'PROGRAMMER', 'Attributs', Constant.FEATURES_BASE_PATH, <BusinessIcon />, { relatedLinks: [Constant.FEATURE_CATEGORIES_BASE_PATH]});
};

export const initReducer = () => {
    setReducer('features', featuresReducer);
};

export const initTab = () => {
    setTab('featuresTabList', () => [
        { label: 'Attributs', component: <Component.FeaturesList />, path: Constant.FEATURES_BASE_PATH },
        { label: 'Catégories d\'attributs', component: <Component.FeatureCategoriesList />, path: Constant.FEATURE_CATEGORIES_BASE_PATH },
    ]);
};

export const initCrud = () => {
    const crud = {
        list: featuresListCrud,
        add: featuresCreateCrud,
        edit: featuresEditCrud,
    };

    setCrud('features', crud);
};
