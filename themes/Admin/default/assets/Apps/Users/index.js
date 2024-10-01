import React from 'react';
import PersonIcon from '@mui/icons-material/Person';

import { CreateUser, usersCreateCrud } from '@Apps/Users/CreateUser/CreateUser';
import { EditUser, usersEditCrud } from '@Apps/Users/EditUser/EditUser';
import { EditProfile } from '@Apps/Users/EditProfile/EditProfile';
import { EditProfileForm } from '@Apps/Users/ProfileForm/EditProfileForm';
import { UserList, usersListCrud } from '@Apps/Users/UserList/UserList';
import usersReducer from '@Apps/Users/redux/users/usersSlice';
import userProfileApi from '@Apps/Users/services/api/userProfileApi';
import usersApi from '@Apps/Users/services/api/usersApi';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';
import { addTabElements } from '@/AdminService/Tab';

export const initConstant = () => {
    setConstant('USER_BASE_PATH', '/admin/utilisateurs');
    setConstant('USER_PROFILE_BASE_PATH', '/admin/profil-utilisateur');
};

export const initComponent = () => {
    setComponent('CreateUser', CreateUser);
    setComponent('EditUser', EditUser);
    setComponent('EditProfile', EditProfile);
    setComponent('EditProfileForm', EditProfileForm);
    setComponent('UserList', UserList);
};

export const initApi = () => {
    setApi('userProfileApi', userProfileApi);
    setApi('usersApi', usersApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.USER_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'usersTabList',
        tabPathValue: Constant.USER_BASE_PATH,
    });
    setAuthenticatedRoute(Constant.USER_BASE_PATH + Constant.CREATE_PATH, Component.CreateUser);
    setAuthenticatedRoute(`${Constant.USER_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditUser);

    setAuthenticatedRoute(`${Constant.USER_PROFILE_BASE_PATH}${Constant.EDIT_PATH}`, Component.EditProfile);
};

export const initMenu = () => {
    insertSubMenu(2, 'ADMINISTRER', 'Utilisateurs', Constant.USER_BASE_PATH, <PersonIcon />);
};

export const initReducer = () => {
    setReducer('users', usersReducer);
};

export const initTab = () => {
    addTabElements('usersTabList', [{ label: 'Utilisateurs', component: <Component.UserList />, path: Constant.USER_BASE_PATH }]);
};

export const initCrud = () => {
    const crud = {
        list: usersListCrud,
        add: usersCreateCrud,
        edit: usersEditCrud,
    };

    setCrud('users', crud);
};
