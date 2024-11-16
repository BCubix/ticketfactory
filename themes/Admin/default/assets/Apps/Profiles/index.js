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

export const initConstant = () => {
    setConstant('PROFILES_BASE_PATH', '/admin/profils');
};

export const initComponent = () => {
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

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.PROFILES_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'usersTabList',
        tabPathValue: Constant.PROFILES_BASE_PATH,
    });
    setAuthenticatedRoute(Constant.PROFILES_BASE_PATH + Constant.CREATE_PATH, Component.CreateProfile);
    setAuthenticatedRoute(`${Constant.PROFILES_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditProfile);
};

export const initTab = () => {
    addTabElements('usersTabList', [{ label: 'Profils', component: <Component.ProfilesList />, path: Constant.PROFILES_BASE_PATH }]);
};

export const initCrud = () => {
    const crud = {
        list: profilesListCrud,
        add: profilesCreateCrud,
        edit: profilesEditCrud,
    };

    setCrud('profiles', crud);
};
