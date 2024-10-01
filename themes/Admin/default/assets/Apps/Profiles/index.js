import React from 'react';

import { ProfileList, profilesListCrud } from './ProfileList/ProfileList';
import userProfilesApi from './services/api.userProfilesApi';
import profilesReducer from './redux/profiles/profilesSlice';

import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setApi } from '@/AdminService/Api';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { addTabElements } from '@/AdminService/Tab';

export const initConstant = () => {
    setConstant('PROFILE_BASE_PATH', '/admin/profils');
};

export const initComponent = () => {
    setComponent('ProfileList', ProfileList);
};

export const initApi = () => {
    setApi('userProfilesApi', userProfilesApi);
};

export const initReducer = () => {
    setReducer('profiles', profilesReducer);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.PROFILE_BASE_PATH, Component.ProfileList, {
        tabListName: 'usersTabList',
        tabPathValue: Constant.PROFILE_BASE_PATH,
    });
};

export const initTab = () => {
    addTabElements('usersTabList', [{ label: 'Profils', component: <Component.ProfileList /> }]);
};

export const initCrud = () => {
    const crud = {
        list: profilesListCrud,
    };

    setCrud('profiles', crud);
};
