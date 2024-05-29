import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    url: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('urlActiveFilter')),
        name: sessionStorage.getItem('urlNameFilter') || '',
    },
};

const urlSlice = createSlice({
    name: 'url',
    initialState: initialState,
    reducers: {
        getUrl: (state) => {
            state.loading = true;
        },

        getUrlSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.url = action.payload.url;
            state.total = action.payload.total;
        },

        getUrlFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.url = null;
        },

        resetUrl: (state) => {
            state = { ...initialState };
        },

        updateUrlFilters: (state, action) => {
            state.filters = action.payload.filters;
        },

        setUrl: (state, action) => {
            state.url = action.payload.url;
        },
    },
});

export function getUrlAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getUrl());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().url?.filters;

                const url = await Api.urlApi.getUrl(state);
                if (!url.result) {
                    dispatch(getUrlFailure({ error: url.error }));

                    return;
                }

                dispatch(getUrlSuccess({ url: url.url, total: url.total }));
            });
        } catch (error) {
            dispatch(getUrlFailure({ error: error.message || error }));
        }
    };
}

export function changeUrlFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('urlActiveFilter', filters?.active);
        sessionStorage.setItem('urlNameFilter', filters?.name);
        sessionStorage.setItem('urlSort', filters?.sort);

        filters.page = page;

        dispatch(updateUrlFilters({ filters: filters }));
        dispatch(getUrlAction(filters));
    };
}

export const { getUrl, getUrlSuccess, getUrlFailure, resetUrl, updateUrlFilters, setUrl } = urlSlice.actions;
export const urlSelector = (state) => state.url;
export default urlSlice.reducer;
