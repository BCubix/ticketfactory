import { createSlice } from '@reduxjs/toolkit';
import authApi from '../../services/api/authApi';
import profileApi from '../../services/api/profileApi';

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        connected: null,
        loading: false,
        error: null,
        user: null,
    },
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
    },
});

export function loginAction(data) {
    return async (dispatch) => {
        try {
            dispatch(login());

            const response = await authApi.login(data);

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

export const { login, loginSuccess, loginFailure } = profileSlice.actions;
export const profileSelector = (state) => state.profile;
export default profileSlice.reducer;
