import { createSlice } from '@reduxjs/toolkit';
import authApi from '../../services/api/authApi';
import pagesApi from '../../services/api/pagesApi';
import { apiMiddleware } from '../../services/utils/apiMiddleware';
import { getBooleanFromString } from '../../services/utils/getBooleanFromString';
import { loginFailure } from '../profile/profileSlice';

const initialState = {
    loading: false,
    error: null,
    pages: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('pagesActiveFilter')),
        title: sessionStorage.getItem('pagesTitleFilter') || '',
        sort: sessionStorage.getItem('pagesSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
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
            state.total = action.payload.total;
        },

        getPagesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.pages = null;
        },

        resetPages: (state) => {
            state = { ...initialState };
        },

        updatePagesFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getPagesAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getPages());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().pages?.filters;

                const pages = await pagesApi.getPages(state);
                if (!pages.result) {
                    dispatch(getPagesFailure({ error: pages.error }));

                    return;
                }

                dispatch(getPagesSuccess({ pages: pages.pages, total: pages.total }));
            });
        } catch (error) {
            dispatch(getPagesFailure({ error: error.message || error }));
        }
    };
}

export function changePagesFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('pagesActiveFilter', filters?.active);
        sessionStorage.setItem('pagesTitleFilter', filters?.title);
        sessionStorage.setItem('pagesSort', filters?.sort);

        filters.page = page;

        dispatch(updatePagesFilters({ filters: filters }));
        dispatch(getPagesAction(filters));
    };
}

export const { getPages, getPagesSuccess, getPagesFailure, resetPages, updatePagesFilters } =
    pagesSlice.actions;
export const pagesSelector = (state) => state.pages;
export default pagesSlice.reducer;
