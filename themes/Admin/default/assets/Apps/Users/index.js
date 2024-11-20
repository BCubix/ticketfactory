import React from 'react';
import PersonIcon from '@mui/icons-material/Person';

import { CreateUser, usersCreateCrud } from '@Apps/Users/CreateUser/CreateUser';
import { EditUser, usersEditCrud } from '@Apps/Users/EditUser/EditUser';
import { EditUserProfile } from '@Apps/Users/EditUserProfile/EditUserProfile';
import { EditUserProfileForm } from '@Apps/Users/UserProfileForm/EditUserProfileForm';
import { UserList, usersListCrud } from '@Apps/Users/UserList/UserList';
import usersReducer from '@Apps/Users/redux/users/usersSlice';
import usersApi from '@Apps/Users/services/api/usersApi';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';
import { addTabElements } from '@/AdminService/Tab';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

const ROLE_READ = 'ROLE_USER_READ';
const ROLE_CREATE = 'ROLE_USER_CREATE';
const ROLE_EDIT = 'ROLE_USER_EDIT';

export const initConstant = () => {
    setConstant('USER_BASE_PATH', '/admin/utilisateurs');
    setConstant('USER_PROFILE_BASE_PATH', '/admin/profil-utilisateur');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setComponent('CreateUser', CreateUser);
    setComponent('EditUser', EditUser);
    setComponent('EditUserProfile', EditUserProfile);
    setComponent('EditUserProfileForm', EditUserProfileForm);
    setComponent('UserList', UserList);
};

export const initApi = () => {
    setApi('usersApi', usersApi);
};

export const initAuthenticatedRoutes = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setAuthenticatedRoute(Constant.USER_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'usersTabList',
        tabPathValue: Constant.USER_BASE_PATH,
    });

    if (checkUserAccess(userRoles, ROLE_CREATE)) {
        setAuthenticatedRoute(Constant.USER_BASE_PATH + Constant.CREATE_PATH, Component.CreateUser);
    }

    if (checkUserAccess(userRoles, ROLE_EDIT)) {
        setAuthenticatedRoute(`${Constant.USER_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditUser);
    }

    setAuthenticatedRoute(`${Constant.USER_PROFILE_BASE_PATH}${Constant.EDIT_PATH}`, Component.EditUserProfile);
};

export const initMenu = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    insertSubMenu(2, 'ADMINISTRER', 'Utilisateurs', Constant.USER_BASE_PATH, <PersonIcon />);
};

export const initReducer = () => {
    setReducer('users', usersReducer);
};

export const initTab = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    addTabElements('usersTabList', [{ label: 'Utilisateurs', component: <Component.UserList />, path: Constant.USER_BASE_PATH }]);
};

export const initCrud = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    const crud = {
        list: usersListCrud,
        add: usersCreateCrud,
        edit: usersEditCrud,
    };

    setCrud('users', crud);
};
