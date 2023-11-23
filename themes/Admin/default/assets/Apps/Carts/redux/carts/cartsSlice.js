import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    carts: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('cartsActiveFilter')),
        sort: sessionStorage.getItem('cartsSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
};

const cartsSlice = createSlice({
    name: 'carts',
    initialState: initialState,
    reducers: {
        getCarts: (state) => {
            state.loading = true;
        },

        getCartsSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.carts = action.payload.carts;
            state.total = action.payload.total;
        },

        getCartsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.carts = null;
        },

        resetCarts: (state) => {
            state = { ...initialState };
        },

        updateCartsFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getCartsAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getCarts());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().carts?.filters;

                const carts = await Api.cartsApi.getCarts(state);

                if (!carts.result) {
                    dispatch(getCartsFailure({ error: carts.error }));

                    return;
                }

                dispatch(getCartsSuccess({ carts: carts.carts, total: carts.total }));
            });
        } catch (error) {
            dispatch(getCartsFailure({ error: error.message || error }));
        }
    };
}

export function changeCartsFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('cartsActiveFilter', filters?.active);
        sessionStorage.setItem('cartsSort', filters?.sort);

        filters.page = page;

        dispatch(updateCartsFilters({ filters: filters }));
        dispatch(getCartsAction(filters));
    };
}

export const { getCarts, getCartsSuccess, getCartsFailure, resetCarts, updateCartsFilters } = cartsSlice.actions;
export const cartsSelector = (state) => state.carts;
export default cartsSlice.reducer;
