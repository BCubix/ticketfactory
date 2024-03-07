import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { loginFailure } from '@Apps/Auth/redux/profile/profileSlice';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

const initialState = {
    loading: false,
    error: null,
    productCategories: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('productCategoriesActiveFilter')),
        name: sessionStorage.getItem('productCategoriesNameFilter') || '',
    },
};

const productCategoriesSlice = createSlice({
    name: 'productCategories',
    initialState: initialState,
    reducers: {
        getProductCategories: (state) => {
            state.loading = true;
        },

        getProductCategoriesSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.productCategories = action.payload.productCategories;
        },

        getProductCategoriesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.productCategories = null;
        },

        resetProductCategories: (state) => {
            state = { ...initialState };
        },

        updateProductCategoriesFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getProductCategoriesAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getProductCategories());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().categories?.filters;

                const productCategories = await Api.productCategoriesApi.getProductCategories(state);
                if (!productCategories.result) {
                    dispatch(getProductCategoriesFailure({ error: productCategories.error }));
                    return;
                }

                dispatch(getProductCategoriesSuccess({ productCategories: productCategories.productCategories }));
            });
        } catch (error) {
            dispatch(getProductCategoriesFailure({ error: error.message || error }));
        }
    };
}

export function changeProductCategoriesFilters(filters) {
    return async (dispatch) => {
        sessionStorage.setItem('productCategoriesActiveFilter', filters?.active);
        sessionStorage.setItem('productCategoriesNameFilter', filters?.name);

        dispatch(updateProductCategoriesFilters({ filters: filters }));
        dispatch(getProductCategoriesAction(filters));
    };
}

export const { getProductCategories, getProductCategoriesSuccess, getProductCategoriesFailure, resetProductCategories, updateProductCategoriesFilters } =
    productCategoriesSlice.actions;
export const productCategoriesSelector = (state) => state.productCategories;
export default productCategoriesSlice.reducer;
