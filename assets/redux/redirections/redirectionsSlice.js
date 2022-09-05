import { createSlice } from '@reduxjs/toolkit';
import authApi from '../../services/api/authApi';
import redirectionsApi from '../../services/api/redirectionsApi';
import { loginFailure } from '../profile/profileSlice';

const initialState = {
    loading: false,
    error: null,
    redirections: null,
};

const redirectionsSlice = createSlice({
    name: 'redirections',
    initialState: initialState,
    reducers: {
        getRedirections: (state) => {
            state.loading = true;
        },

        getRedirectionsSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.redirections = action.payload.redirections;
        },

        getRedirectionsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.redirections = null;
        },

        resetRedirections: (state) => {
            state = { ...initialState };
        },
    },
});

export function getRedirectionsAction(data) {
    return async (dispatch) => {
        try {
            dispatch(getRedirections());

            const response = await authApi.checkIsAuth();

            if (!response.result) {
                dispatch(loginFailure({ error: response.error }));

                return;
            }

            const redirections = await redirectionsApi.getRedirections(data);

            if (!redirections.result) {
                dispatch(getRedirectionsFailure({ error: redirections.error }));

                return;
            }

            dispatch(getRedirectionsSuccess({ redirections: redirections.redirections }));
        } catch (error) {
            dispatch(getRedirectionsFailure({ error: error.message || error }));
        }
    };
}

export const {
    getRedirections,
    getRedirectionsSuccess,
    getRedirectionsFailure,
    resetRedirections,
} = redirectionsSlice.actions;

export const redirectionsSelector = (state) => state.redirections;

export default redirectionsSlice.reducer;
