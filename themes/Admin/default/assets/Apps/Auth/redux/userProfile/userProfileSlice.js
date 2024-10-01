import { NotificationManager } from 'react-notifications';
import { createSlice } from '@reduxjs/toolkit';

import { Api } from '@/AdminService/Api';
import { Constant } from '@/AdminService/Constant';

const initialState = {
    connected: null,
    modulesLoaded: null,
    appMenus: [],
    appAuthenticatedRoutes: [],
    loading: false,
    error: null,
    user: null,
};

const userProfileSlice = createSlice({
    name: 'userProfile',
    initialState: initialState,
    reducers: {
        login: (state) => {
            state.loading = true;
        },

        loginSuccess: (state, action) => {
            state.loading = false;
            state.connected = true;
            state.error = null;
            state.user = action.payload.user;
        },

        loginFailure: (state, action) => {
            state.loading = false;
            state.connected = false;
            state.error = action.payload.error;
            state.user = null;
        },

        logout: (state) => {
            state.connected = false;
            state.loading = false;
            state.error = null;
            state.user = null;
        },

        setModulesLoaded: (state, action) => {
            state.modulesLoaded = action.payload.modulesLoaded;
        },

        setAppMenus: (state, action) => {
            state.appMenus = action.payload.appMenus;
        },

        setAppAuthenticatedRoutes: (state, action) => {
            state.appAuthenticatedRoutes = action.payload.appAuthenticatedRoutes;
        },
    },
});

export function loginAction(data) {
    return async (dispatch) => {
        try {
            dispatch(login());

            const response = await Api.authApi.login(data);

            if (!response.result) {
                NotificationManager.error(response?.error?.code === 401 ? 'Email ou mot de passe incorrect.' : 'Une erreur est survenue.', 'Erreur', Constant.REDIRECTION_TIME);

                dispatch(loginFailure({ error: response.error }));

                return;
            }

            const userProfile = await Api.userProfileApi.getProfile(data);

            if (!userProfile.result) {
                dispatch(loginFailure({ error: userProfile.error }));
            }

            dispatch(loginSuccess({ user: userProfile.userProfile }));
        } catch (error) {
            dispatch(loginFailure({ error: error.message || error }));
        }
    };
}

export function userProfileInitAction(data) {
    return async (dispatch) => {
        try {
            dispatch(login());

            const response = await Api.authApi.checkIsAuth();

            if (!response.result) {
                dispatch(loginFailure({ error: response.error }));

                return;
            }

            const userProfile = await Api.userProfileApi.getProfile(data);

            if (!userProfile.result) {
                dispatch(loginFailure({ error: userProfile.error }));

                return;
            }

            dispatch(loginSuccess({ user: userProfile.userProfile }));
        } catch (error) {
            dispatch(loginFailure({ error: error.message || error }));
        }
    };
}

export function logoutAction() {
    return async (dispatch) => {
        try {
            Api.authApi.logout();

            dispatch(logout());

            return;
        } catch (error) {
            console.error(error);
        }
    };
}

export const { login, loginSuccess, loginFailure, logout, setModulesLoaded, setAppMenus, setAppAuthenticatedRoutes } = userProfileSlice.actions;
export const userProfileSelector = (state) => state.userProfile;
export default userProfileSlice.reducer;
