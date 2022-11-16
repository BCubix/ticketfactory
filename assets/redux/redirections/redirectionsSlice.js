import { createSlice } from '@reduxjs/toolkit';
import { Api } from "@/AdminService/Api";
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    redirections: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('redirectionsActiveFilter')),
        redirectType: sessionStorage.getItem('redirectionsRedirectTypeFilter') || '',
        redirectFrom: sessionStorage.getItem('redirectionsRedirectFromFilter') || '',
        redirectTo: sessionStorage.getItem('redirectionsRedirectToFilter') || '',
        sort: sessionStorage.getItem('redirectionsSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
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
            state.total = action.payload.total;
        },

        getRedirectionsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.redirections = null;
        },

        resetRedirections: (state) => {
            state = { ...initialState };
        },

        updateRedirectionsFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getRedirectionsAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getRedirections());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().redirections?.filters;

                const redirections = await Api.redirectionsApi.getRedirections(state);
                if (!redirections.result) {
                    dispatch(getRedirectionsFailure({ error: redirections.error }));

                    return;
                }

                dispatch(
                    getRedirectionsSuccess({
                        redirections: redirections.redirections,
                        total: redirections.total,
                    })
                );
            });
        } catch (error) {
            dispatch(getRedirectionsFailure({ error: error.message || error }));
        }
    };
}

export function changeRedirectionsFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('redirectionsActiveFilter', filters?.active);
        sessionStorage.setItem('redirectionsRedirectTypeFilter', filters?.redirectType);
        sessionStorage.setItem('redirectionsRedirectFromFilter', filters?.redirectFrom);
        sessionStorage.setItem('redirectionsRedirectToFilter', filters?.redirectTo);
        sessionStorage.setItem('redirectionsSort', filters?.sort);

        filters.page = page;

        dispatch(updateRedirectionsFilters({ filters: filters }));
        dispatch(getRedirectionsAction(filters));
    };
}

export const {
    getRedirections,
    getRedirectionsSuccess,
    getRedirectionsFailure,
    resetRedirections,
    updateRedirectionsFilters,
} = redirectionsSlice.actions;

export const redirectionsSelector = (state) => state.redirections;

export default redirectionsSlice.reducer;
