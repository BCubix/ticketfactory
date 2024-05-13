import { Login } from '@Apps/Auth/Login/Login';
import { LoginBackgroundWrapper, LoginComponentWrapper, LoginPageWrapper } from '@Apps/Auth/Login/sc.Login';
import { ForgotPassword } from '@Apps/Auth/ForgotPassword/ForgotPassword';
import { ChangePassword } from '@Apps/Auth/ChangePassword/ChangePassword';

import { setReducer } from '@/AdminService/Reducer';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setNonAuthenticatedRoute } from '@/AdminService/NonAuthenticatedRoute';

import profileReducer from './redux/profile/profileSlice';
import authApi from './services/api/authApi';

export const initConstant = () => {
    setConstant('LOGIN_PATH', '/admin/connexion');
    setConstant('MODIFY_PASSWORD_PATH', '/admin/modifier-mon-mot-de-passe');
    setConstant('FORGOT_PASSWORD_PATH', '/admin/mot-de-passe-oublie');
};

export const initComponent = () => {
    setComponent('Login', Login);
    setComponent('LoginPageWrapper', LoginPageWrapper);
    setComponent('LoginComponentWrapper', LoginComponentWrapper);
    setComponent('LoginBackgroundWrapper', LoginBackgroundWrapper);

    setComponent('ForgotPassword', ForgotPassword);

    setComponent('ChangePassword', ChangePassword);
};

export const initApi = () => {
    setApi('authApi', authApi);
};

export const initNonAuthenticatedRoutes = () => {
    setNonAuthenticatedRoute(Constant.LOGIN_PATH, Component.Login);
    setNonAuthenticatedRoute(Constant.FORGOT_PASSWORD_PATH, Component.ForgotPassword);
    setNonAuthenticatedRoute(Constant.MODIFY_PASSWORD_PATH, Component.ChangePassword);
};
