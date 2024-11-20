import React from 'react';
import BusinessIcon from '@mui/icons-material/Business';

import { CreateFeature, featuresCreateCrud } from '@Apps/Features/CreateFeature/CreateFeature';
import { EditFeature, featuresEditCrud } from '@Apps/Features/EditFeature/EditFeature';
import { FeaturesList, featuresListCrud } from '@Apps/Features/FeaturesList/FeaturesList';
import featuresApi from '@Apps/Features/services/api/featuresApi';
import featuresReducer from '@Apps/Features/redux/features/featuresSlice';

import { setApi } from '@/AdminService/Api';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { Component, setComponent } from '@/AdminService/Component';
import { Constant, setConstant } from '@/AdminService/Constant';
import { setCrud } from '@/AdminService/Crud';
import { insertSubMenu } from '@/AdminService/Menu';
import { setReducer } from '@/AdminService/Reducer';
import { addTabElements } from '@/AdminService/Tab';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

const ROLE_READ = 'ROLE_FEATURE_READ';
const ROLE_CREATE = 'ROLE_FEATURE_CREATE';
const ROLE_EDIT = 'ROLE_FEATURE_EDIT';

export const initConstant = () => {
    setConstant('FEATURES_BASE_PATH', '/admin/attributs');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setComponent('FeaturesList', FeaturesList);
    setComponent('CreateFeature', CreateFeature);
    setComponent('EditFeature', EditFeature);
};

export const initApi = () => {
    setApi('featuresApi', featuresApi);
};

export const initAuthenticatedRoutes = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setAuthenticatedRoute(Constant.FEATURES_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'featuresTabList',
        tabPathValue: Constant.FEATURES_BASE_PATH,
    });

    if (checkUserAccess(userRoles, ROLE_CREATE)) {
        setAuthenticatedRoute(Constant.FEATURES_BASE_PATH + Constant.CREATE_PATH, Component.CreateFeature);
    }

    if (checkUserAccess(userRoles, ROLE_EDIT)) {
        setAuthenticatedRoute(`${Constant.FEATURES_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditFeature);
    }
};

export const initMenu = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    insertSubMenu(4, 'PROGRAMMATION', 'Attributs', Constant.FEATURES_BASE_PATH, <BusinessIcon />, { relatedLinks: [Constant.FEATURE_CATEGORIES_BASE_PATH] });
};

export const initReducer = () => {
    setReducer('features', featuresReducer);
};

export const initTab = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    addTabElements('featuresTabList', [{ label: 'Attributs', component: <Component.FeaturesList />, path: Constant.FEATURES_BASE_PATH }]);
};

export const initCrud = () => {
    const crud = {
        list: featuresListCrud,
        add: featuresCreateCrud,
        edit: featuresEditCrud,
    };

    setCrud('features', crud);
};
