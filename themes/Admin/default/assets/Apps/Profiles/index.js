import React from 'react';

import { ProfilesList, profilesListCrud } from './ProfilesList/ProfilesList';
import { CreateProfile, profilesCreateCrud } from './CreateProfile/CreateProfile';
import { EditProfile, profilesEditCrud } from './EditProfile/EditProfile';
import { ProfileRightsForm } from './ProfilesForm/ProfileRightsForm';
import profilesApi from './services/api/profilesApi';
import rolesApi from './services/api/rolesApi';
import profilesReducer from './redux/profiles/profilesSlice';

import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setApi } from '@/AdminService/Api';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';
import { setReducer } from '@/AdminService/Reducer';
import { addTabElements } from '@/AdminService/Tab';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

const ROLE_READ = 'ROLE_PROFILE_READ';
const ROLE_CREATE = 'ROLE_PROFILE_CREATE';
const ROLE_EDIT = 'ROLE_PROFILE_EDIT';

export const initConstant = () => {
    setConstant('PROFILES_BASE_PATH', '/admin/profils');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setComponent('ProfilesList', ProfilesList);
    setComponent('ProfileRightsForm', ProfileRightsForm);
    setComponent('CreateProfile', CreateProfile);
    setComponent('EditProfile', EditProfile);
};

export const initApi = () => {
    setApi('profilesApi', profilesApi);
    setApi('rolesApi', rolesApi);
};

export const initReducer = () => {
    setReducer('profiles', profilesReducer);
};

export const initAuthenticatedRoutes = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setAuthenticatedRoute(Constant.PROFILES_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'usersTabList',
        tabPathValue: Constant.PROFILES_BASE_PATH,
    });

    if (checkUserAccess(userRoles, ROLE_CREATE)) {
        setAuthenticatedRoute(Constant.PROFILES_BASE_PATH + Constant.CREATE_PATH, Component.CreateProfile);
    }

    if (checkUserAccess(userRoles, ROLE_EDIT)) {
        setAuthenticatedRoute(`${Constant.PROFILES_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditProfile);
    }
};

export const initTab = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    addTabElements('usersTabList', [{ label: 'Profils', component: <Component.ProfilesList />, path: Constant.PROFILES_BASE_PATH }]);
};

export const initCrud = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    const crud = {
        list: profilesListCrud,
        add: profilesCreateCrud,
        edit: profilesEditCrud,
    };

    setCrud('profiles', crud);
};
