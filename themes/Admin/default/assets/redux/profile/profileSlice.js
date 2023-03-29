import { NotificationManager } from 'react-notifications';
import { createSlice } from '@reduxjs/toolkit';

import { Api } from '@/AdminService/Api';
import { Constant } from '@/AdminService/Constant';

import { resetCategories } from '@Redux/categories/categoriesSlice';
import { resetEvents } from '@Redux/events/eventsSlice';
import { resetRooms } from '@Redux/rooms/roomsSlice';
import { resetSeasons } from '@Redux/seasons/seasonsSlice';
import { resetUsers } from '@Redux/users/usersSlice';

const initialState = {
    connected: null,
    modulesLoaded: null,
    loading: false,
    error: null,
    user: null,
};

const profileSlice = createSlice({
    name: 'profile',
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

            const profile = await Api.profileApi.getProfile(data);

            if (!profile.result) {
                dispatch(loginFailure({ error: profile.error }));
            }

            dispatch(loginSuccess({ user: profile.profile }));
        } catch (error) {
            dispatch(loginFailure({ error: error.message || error }));
        }
    };
}

export function profileInitAction(data) {
    return async (dispatch) => {
        try {
            dispatch(login());

            const response = await Api.authApi.checkIsAuth();

            if (!response.result) {
                dispatch(loginFailure({ error: response.error }));

                return;
            }

            const profile = await Api.profileApi.getProfile(data);

            if (!profile.result) {
                dispatch(loginFailure({ error: profile.error }));

                return;
            }

            dispatch(loginSuccess({ user: profile.profile }));
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
            dispatch(resetCategories());
            dispatch(resetEvents());
            dispatch(resetRooms());
            dispatch(resetSeasons());
            dispatch(resetUsers());

            return;
        } catch (error) {
            console.error(error);
        }
    };
}

export const { login, loginSuccess, loginFailure, logout, setModulesLoaded } = profileSlice.actions;
export const profileSelector = (state) => state.profile;
export default profileSlice.reducer;
