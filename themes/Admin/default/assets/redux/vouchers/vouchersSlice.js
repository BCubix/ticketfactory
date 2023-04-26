import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    vouchers: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('vouchersActiveFilter')),
        sort: sessionStorage.getItem('vouchersSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
};

const vouchersSlice = createSlice({
    name: 'vouchers',
    initialState: initialState,
    reducers: {
        getVouchers: (state) => {
            state.loading = true;
        },

        getVouchersSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.vouchers = action.payload.vouchers;
            state.total = action.payload.total;
        },

        getVouchersFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.vouchers = null;
        },

        resetVouchers: (state) => {
            state = { ...initialState };
        },

        updateVouchersFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getVouchersAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getVouchers());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().vouchers?.filters;

                const vouchers = await Api.vouchersApi.getVouchers(state);

                if (!vouchers.result) {
                    dispatch(getVouchersFailure({ error: vouchers.error }));

                    return;
                }

                dispatch(getVouchersSuccess({ vouchers: vouchers.vouchers, total: vouchers.total }));
            });
        } catch (error) {
            dispatch(getVouchersFailure({ error: error.message || error }));
        }
    };
}

export function changeVouchersFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('vouchersActiveFilter', filters?.active);
        sessionStorage.setItem('vouchersSort', filters?.sort);

        filters.page = page;

        dispatch(updateVouchersFilters({ filters: filters }));
        dispatch(getVouchersAction(filters));
    };
}

export const { getVouchers, getVouchersSuccess, getVouchersFailure, resetVouchers, updateVouchersFilters } = vouchersSlice.actions;
export const vouchersSelector = (state) => state.vouchers;
export default vouchersSlice.reducer;
