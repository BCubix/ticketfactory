import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    subscriptions: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('subscriptionsActiveFilter')),
        name: sessionStorage.getItem('subscriptionsNameFilter') || '',
        sort: sessionStorage.getItem('subscriptionsSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
};

const subscriptionsSlice = createSlice({
    name: 'subscriptions',
    initialState: initialState,
    reducers: {
        getSubscriptions: (state) => {
            state.loading = true;
        },

        getSubscriptionsSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.subscriptions = action.payload.subscriptions;
            state.total = action.payload.total;
        },

        getSubscriptionsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.subscriptions = null;
        },

        resetSubscriptions: (state) => {
            state = { ...initialState };
        },

        updateSubscriptionsFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getSubscriptionsAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getSubscriptions());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().subscriptions?.filters;

                const subscriptions = await Api.subscriptionsApi.getSubscriptions(state);
                if (!subscriptions.result) {
                    dispatch(getSubscriptionsFailure({ error: subscriptions.error }));

                    return;
                }

                dispatch(getSubscriptionsSuccess({ subscriptions: subscriptions.subscriptions, total: subscriptions.total }));
            });
        } catch (error) {
            dispatch(getSubscriptionsFailure({ error: error.message || error }));
        }
    };
}

export function changeSubscriptionsFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('subscriptionsActiveFilter', filters?.active);
        sessionStorage.setItem('subscriptionsNameFilter', filters?.name);
        sessionStorage.setItem('subscriptionsSort', filters?.sort);

        filters.page = page;

        dispatch(updateSubscriptionsFilters({ filters: filters }));
        dispatch(getSubscriptionsAction(filters));
    };
}

export const { getSubscriptions, getSubscriptionsSuccess, getSubscriptionsFailure, resetSubscriptions, updateSubscriptionsFilters } = subscriptionsSlice.actions;
export const subscriptionsSelector = (state) => state.subscriptions;
export default subscriptionsSlice.reducer;
