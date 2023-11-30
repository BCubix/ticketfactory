import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    products: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('productsActiveFilter')),
        name: sessionStorage.getItem('productsNameFilter') || '',
        category: sessionStorage.getItem('productsCategoryFilter') || '',
        sort: sessionStorage.getItem('productsSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
};

const productsSlice = createSlice({
    name: 'products',
    initialState: initialState,
    reducers: {
        getProducts: (state) => {
            state.loading = true;
        },

        getProductsSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.products = action.payload.products;
            state.total = action.payload.total;
        },

        getProductsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.products = null;
        },

        resetProducts: (state) => {
            state = { ...initialState };
        },

        updateProductsFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getProductsAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getProducts());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().products?.filters;

                const products = await Api.productsApi.getProducts(state);

                if (!products.result) {
                    dispatch(getProductsFailure({ error: products.error }));

                    return;
                }

                dispatch(getProductsSuccess({ products: products.products, total: products.total }));
            });
        } catch (error) {
            dispatch(getProductsFailure({ error: error.message || error }));
        }
    };
}

export function changeProductsFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('productsActiveFilter', filters?.active);
        sessionStorage.setItem('productsNameFilter', filters?.name);
        sessionStorage.setItem('productsCategoryFilter', filters?.category);
        sessionStorage.setItem('productsSort', filters?.sort);

        filters.page = page;

        dispatch(updateProductsFilters({ filters: filters }));
        dispatch(getProductsAction(filters));
    };
}

export const { getProducts, getProductsSuccess, getProductsFailure, resetProducts, updateProductsFilters } = productsSlice.actions;
export const productsSelector = (state) => state.products;
export default productsSlice.reducer;
