import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    discounts: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('discountsActiveFilter')),
        sort: sessionStorage.getItem('discountsSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
};

const discountsSlice = createSlice({
    name: 'discounts',
    initialState: initialState,
    reducers: {
        getDiscounts: (state) => {
            state.loading = true;
        },

        getDiscountsSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.discounts = action.payload.discounts;
            state.total = action.payload.total;
        },

        getDiscountsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.discounts = null;
        },

        resetDiscounts: (state) => {
            state = { ...initialState };
        },

        updateDiscountsFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getDiscountsAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getDiscounts());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().discounts?.filters;

                const discounts = await Api.discountsApi.getDiscounts(state);

                if (!discounts.result) {
                    dispatch(getDiscountsFailure({ error: discounts.error }));

                    return;
                }

                dispatch(getDiscountsSuccess({ discounts: discounts.discounts, total: discounts.total }));
            });
        } catch (error) {
            dispatch(getDiscountsFailure({ error: error.message || error }));
        }
    };
}

export function changeDiscountsFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('discountsActiveFilter', filters?.active);
        sessionStorage.setItem('discountsSort', filters?.sort);

        filters.page = page;

        dispatch(updateDiscountsFilters({ filters: filters }));
        dispatch(getDiscountsAction(filters));
    };
}

export const { getDiscounts, getDiscountsSuccess, getDiscountsFailure, resetDiscounts, updateDiscountsFilters } = discountsSlice.actions;
export const discountsSelector = (state) => state.discounts;
export default discountsSlice.reducer;
