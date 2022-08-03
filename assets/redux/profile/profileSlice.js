import { createSlice } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';
import authApi from '../../services/api/authApi';
import profileApi from '../../services/api/profileApi';
import { resetCategories } from '../categories/categoriesSlice';
import { resetEvents } from '../events/eventsSlice';
import { resetRooms } from '../rooms/roomsSlice';
import { resetSeasons } from '../seasons/seasonsSlice';
import { resetUsers } from '../users/usersSlice';

const initialState = {
    connected: null,
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
    },
});

export function loginAction(data) {
    return async (dispatch) => {
        try {
            dispatch(login());

            const response = await authApi.login(data);

            console.log(response);
            if (!response.result) {
                dispatch(loginFailure({ error: response.error }));

                return;
            }

            const profile = await profileApi.getProfile(data);

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

            const response = await authApi.checkIsAuth();

            if (!response.result) {
                dispatch(loginFailure({ error: response.error }));

                return;
            }

            const profile = await profileApi.getProfile(data);

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
            authApi.logout();

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

export const { login, loginSuccess, loginFailure, logout } = profileSlice.actions;
export const profileSelector = (state) => state.profile;
export default profileSlice.reducer;
