import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    customers: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('customersActiveFilter')),
        email: sessionStorage.getItem('customersEmailFilter') || '',
        firstName: sessionStorage.getItem('customersFirstNameFilter') || '',
        lastName: sessionStorage.getItem('customersLastNameFilter') || '',
        sort: sessionStorage.getItem('customersSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
};

const customersSlice = createSlice({
    name: 'customers',
    initialState: initialState,
    reducers: {
        getCustomers: (state) => {
            state.loading = true;
        },

        getCustomersSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.customers = action.payload.customers;
            state.total = action.payload.total;
        },

        getCustomersFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.customers = null;
        },

        resetCustomers: (state) => {
            state = { ...initialState };
        },

        updateCustomersFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getCustomersAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getCustomers());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().customers?.filters;

                const customers = await Api.customersApi.getCustomers(state);

                if (!customers.result) {
                    dispatch(getCustomersFailure({ error: customers.error }));

                    return;
                }

                dispatch(getCustomersSuccess({ customers: customers.customers, total: customers.total }));
            });
        } catch (error) {
            dispatch(getCustomersFailure({ error: error.message || error }));
        }
    };
}

export function changeCustomersFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('customersActiveFilter', filters?.active);
        sessionStorage.setItem('customersEmailFilter', filters?.email);
        sessionStorage.setItem('customersFirstNameFilter', filters?.firstName);
        sessionStorage.setItem('customersLastNameFilter', filters?.lastName);
        sessionStorage.setItem('customersSort', filters?.sort);

        filters.page = page;

        dispatch(updateCustomersFilters({ filters: filters }));
        dispatch(getCustomersAction(filters));
    };
}

export const { getCustomers, getCustomersSuccess, getCustomersFailure, resetCustomers, updateCustomersFilters } = customersSlice.actions;
export const customersSelector = (state) => state.customers;
export default customersSlice.reducer;
