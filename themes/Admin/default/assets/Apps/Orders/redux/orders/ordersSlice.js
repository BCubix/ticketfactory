import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    orders: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('ordersActiveFilter')),
        sort: sessionStorage.getItem('ordersSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState: initialState,
    reducers: {
        getOrders: (state) => {
            state.loading = true;
        },

        getOrdersSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.orders = action.payload.orders;
            state.total = action.payload.total;
        },

        getOrdersFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.orders = null;
        },

        resetOrders: (state) => {
            state = { ...initialState };
        },

        updateOrdersFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getOrdersAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getOrders());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().orders?.filters;

                const orders = await Api.ordersApi.getOrders(state);

                if (!orders.result) {
                    dispatch(getOrdersFailure({ error: orders.error }));

                    return;
                }

                dispatch(getOrdersSuccess({ orders: orders.orders, total: orders.total }));
            });
        } catch (error) {
            dispatch(getOrdersFailure({ error: error.message || error }));
        }
    };
}

export function changeOrdersFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('ordersActiveFilter', filters?.active);
        sessionStorage.setItem('ordersSort', filters?.sort);

        filters.page = page;

        dispatch(updateOrdersFilters({ filters: filters }));
        dispatch(getOrdersAction(filters));
    };
}

export const { getOrders, getOrdersSuccess, getOrdersFailure, resetOrders, updateOrdersFilters } = ordersSlice.actions;
export const ordersSelector = (state) => state.orders;
export default ordersSlice.reducer;
