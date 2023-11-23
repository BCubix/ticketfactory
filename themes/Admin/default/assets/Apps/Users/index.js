import React from 'react';

import { CreateUser } from '@Apps/Users/CreateUser/CreateUser';
import { EditUser } from '@Apps/Users/EditUser/EditUser';
import { EditProfile } from '@Apps/Users/EditProfile/EditProfile';
import { CreateUserForm } from '@Apps/Users/UserForm/CreateUserForm';
import { EditUserForm } from '@Apps/Users/UserForm/EditUserForm';
import { EditProfileForm } from '@Apps/Users/ProfileForm/EditProfileForm';
import { UserFilters } from '@Apps/Users/UserList/UserFilters/UserFilters';
import { UserList } from '@Apps/Users/UserList/UserList';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';

import usersReducer from '@Apps/Users/redux/users/usersSlice';
import profileApi from '@Apps/Users/services/api/profileApi';
import usersApi from '@Apps/Users/services/api/usersApi';

import PersonIcon from '@mui/icons-material/Person';

export const initConstant = () => {
    setConstant('USER_BASE_PATH', '/admin/utilisateurs');
    setConstant('PROFILE_BASE_PATH', '/admin/profil');
};

export const initComponent = () => {
    setComponent('CreateUser', CreateUser);
    setComponent('EditUser', EditUser);
    setComponent('EditProfile', EditProfile);
    setComponent('CreateUserForm', CreateUserForm);
    setComponent('EditUserForm', EditUserForm);
    setComponent('EditProfileForm', EditProfileForm);
    setComponent('UserFilters', UserFilters);
    setComponent('UserList', UserList);
};

export const initApi = () => {
    setApi('profileApi', profileApi);
    setApi('usersApi', usersApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.USER_BASE_PATH, Component.UserList);
    setAuthenticatedRoute(Constant.USER_BASE_PATH + Constant.CREATE_PATH, Component.CreateUser);
    setAuthenticatedRoute(`${Constant.USER_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditUser);

    setAuthenticatedRoute(`${Constant.PROFILE_BASE_PATH}${Constant.EDIT_PATH}`, Component.EditProfile);
};

export const initMenu = () => {
    insertSubMenu(2, 'ADMINISTRER', 'Utilisateurs', Constant.USER_BASE_PATH, <PersonIcon />);
};

export const initReducer = () => {
    setReducer('users', usersReducer);
};
