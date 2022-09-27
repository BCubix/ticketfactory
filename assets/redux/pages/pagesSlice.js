import { createSlice } from '@reduxjs/toolkit';
import authApi from '../../services/api/authApi';
import pagesApi from '../../services/api/pagesApi';
import { loginFailure } from '../profile/profileSlice';

const initialState = {
    loading: false,
    error: null,
    pages: null,
};

const pagesSlice = createSlice({
    name: 'pages',
    initialState: initialState,
    reducers: {
        getPages: (state) => {
            state.loading = true;
        },

        getPagesSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.pages = action.payload.pages;
        },

        getPagesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.pages = null;
        },

        resetPages: (state) => {
            state = { ...initialState };
        },
    },
});

export function getPagesAction(data) {
    return async (dispatch) => {
        try {
            dispatch(getPages());

            const response = await authApi.checkIsAuth();

            if (!response.result) {
                dispatch(loginFailure({ error: response.error }));

                return;
            }

            const pages = await pagesApi.getPages(data);

            if (!pages.result) {
                dispatch(getPagesFailure({ error: pages.error }));

                return;
            }

            dispatch(getPagesSuccess({ pages: pages.pages }));
        } catch (error) {
            dispatch(getPagesFailure({ error: error.message || error }));
        }
    };
}

export const { getPages, getPagesSuccess, getPagesFailure, resetPages } = pagesSlice.actions;
export const pagesSelector = (state) => state.pages;
export default pagesSlice.reducer;