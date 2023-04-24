import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@/services/utils/apiMiddleware';
import { getBooleanFromString } from '@/services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    newses: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('newsesActiveFilter')),
        title: sessionStorage.getItem('newsesTitleFilter') || '',
        homeDisplayed: getBooleanFromString(sessionStorage.getItem('newsesHomeDisplayedFilter')),
        sort: sessionStorage.getItem('newsesSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
};

const newsesSlice = createSlice({
    name: 'newses',
    initialState: initialState,
    reducers: {
        getNewses: (state) => {
            state.loading = true;
        },

        getNewsesSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.newses = action.payload.newses;
            state.total = action.payload.total;
        },

        getNewsesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.newses = null;
        },

        resetNewses: (state) => {
            state = { ...initialState };
        },

        updateNewsesFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getNewsesAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getNewses());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().newses?.filters;

                const newses = await Api.newsesApi.getNewses(state);
                if (!newses.result) {
                    dispatch(getNewsesFailure({ error: newses.error }));

                    return;
                }

                dispatch(getNewsesSuccess({ newses: newses.newses, total: newses.total }));
            });
        } catch (error) {
            dispatch(getNewsesFailure({ error: error.message || error }));
        }
    };
}

export function changeNewsesFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('newsesActiveFilter', filters?.active);
        sessionStorage.setItem('newsesTitleFilter', filters?.title);
        sessionStorage.setItem('newsesHomeDisplayedFilter', filters?.homeDisplayed);
        sessionStorage.setItem('newsesSort', filters?.sort);

        filters.page = page;

        dispatch(updateNewsesFilters({ filters: filters }));
        dispatch(getNewsesAction(filters));
    };
}

export const { getNewses, getNewsesSuccess, getNewsesFailure, resetNewses, updateNewsesFilters } = newsesSlice.actions;
export const newsesSelector = (state) => state.newses;
export default newsesSlice.reducer;
