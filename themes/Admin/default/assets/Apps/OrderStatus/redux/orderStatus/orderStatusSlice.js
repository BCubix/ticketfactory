import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    orderStatus: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('orderStatusActiveFilter')),
        name: sessionStorage.getItem('orderStatusNameFilter') || '',
        sort: sessionStorage.getItem('orderStatusSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
};

const orderStatusSlice = createSlice({
    name: 'orderStatus',
    initialState: initialState,
    reducers: {
        getOrderStatus: (state) => {
            state.loading = true;
        },

        getOrderStatusSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.orderStatus = action.payload.orderStatus;
            state.total = action.payload.total;
        },

        getOrderStatusFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.orderStatus = null;
        },

        resetOrderStatus: (state) => {
            state = { ...initialState };
        },

        updateOrderStatusFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getOrderStatusAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getOrderStatus());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().orderStatus?.filters;

                const orderStatus = await Api.orderStatusApi.getOrderStatus(state);
                if (!orderStatus.result) {
                    dispatch(getOrderStatusFailure({ error: orderStatus.error }));

                    return;
                }

                dispatch(getOrderStatusSuccess({ orderStatus: orderStatus.orderStatus, total: orderStatus.total }));
            });
        } catch (error) {
            dispatch(getOrderStatusFailure({ error: error.message || error }));
        }
    };
}

export function changeOrderStatusFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('orderStatusActiveFilter', filters?.active);
        sessionStorage.setItem('orderStatusNameFilter', filters?.name);
        sessionStorage.setItem('orderStatusSort', filters?.sort);

        filters.page = page;

        dispatch(updateOrderStatusFilters({ filters: filters }));
        dispatch(getOrderStatusAction(filters));
    };
}

export const { getOrderStatus, getOrderStatusSuccess, getOrderStatusFailure, resetOrderStatus, updateOrderStatusFilters } = orderStatusSlice.actions;
export const orderStatusSelector = (state) => state.orderStatus;
export default orderStatusSlice.reducer;
