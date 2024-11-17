import React from 'react';

import { CreateFeatureCategory, featureCategoriesCreateCrud } from '@Apps/FeatureCategories/CreateFeatureCategory/CreateFeatureCategory';
import { EditFeatureCategory, featureCategoriesEditCrud } from '@Apps/FeatureCategories/EditFeatureCategory/EditFeatureCategory';
import { FeatureCategoriesList, featureCategoriesListCrud } from '@Apps/FeatureCategories/FeatureCategoriesList/FeatureCategoriesList';
import featureCategoriesReducer from '@Apps/FeatureCategories/redux/featureCategories/featureCategoriesSlice';
import featureCategoriesApi from '@Apps/FeatureCategories/services/api/featureCategoriesApi';

import { setApi } from '@/AdminService/Api';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { Component, setComponent } from '@/AdminService/Component';
import { Constant, setConstant } from '@/AdminService/Constant';
import { setCrud } from '@/AdminService/Crud';
import { setReducer } from '@/AdminService/Reducer';
import { addTabElements } from '@/AdminService/Tab';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

export const initConstant = () => {
    setConstant('FEATURE_CATEGORIES_BASE_PATH', '/admin/categories-des-attributs');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_FEATURE_CATEGORY_READ')) {
        return;
    }

    setComponent('FeatureCategoriesList', FeatureCategoriesList);
    setComponent('CreateFeatureCategory', CreateFeatureCategory);
    setComponent('EditFeatureCategory', EditFeatureCategory);
};

export const initApi = () => {
    setApi('featureCategoriesApi', featureCategoriesApi);
};

export const initAuthenticatedRoutes = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_FEATURE_CATEGORY_READ')) {
        return;
    }

    setAuthenticatedRoute(Constant.FEATURE_CATEGORIES_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'featuresTabList',
        tabPathValue: Constant.FEATURE_CATEGORIES_BASE_PATH,
    });
    setAuthenticatedRoute(Constant.FEATURE_CATEGORIES_BASE_PATH + Constant.CREATE_PATH, Component.CreateFeatureCategory);
    setAuthenticatedRoute(`${Constant.FEATURE_CATEGORIES_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditFeatureCategory);
};

export const initReducer = () => {
    setReducer('featureCategories', featureCategoriesReducer);
};

export const initTab = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_FEATURE_CATEGORY_READ')) {
        return;
    }

    addTabElements('featuresTabList', [{ label: "Catégories d'attributs", component: <Component.FeatureCategoriesList />, path: Constant.FEATURE_CATEGORIES_BASE_PATH }], 1);
};

export const initCrud = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_FEATURE_CATEGORY_READ')) {
        return;
    }

    const crud = {
        list: featureCategoriesListCrud,
        add: featureCategoriesCreateCrud,
        edit: featureCategoriesEditCrud,
    };

    setCrud('featureCategories', crud);
};
