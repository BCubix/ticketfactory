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
    setAuthenticatedRoute(Constant.FEATURE_CATEGORIES_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'featuresTabList',
        path: Constant.FEATURE_CATEGORIES_BASE_PATH,
    });
    setAuthenticatedRoute(Constant.FEATURE_CATEGORIES_BASE_PATH + Constant.CREATE_PATH, Component.CreateFeatureCategory);
    setAuthenticatedRoute(`${Constant.FEATURE_CATEGORIES_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditFeatureCategory);
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
