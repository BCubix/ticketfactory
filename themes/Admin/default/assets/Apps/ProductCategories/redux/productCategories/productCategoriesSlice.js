import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { loginFailure } from '@Apps/Auth/redux/profile/profileSlice';

const initialState = {
    loading: false,
    error: null,
    productCategories: null,
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
    },
});

export function getProductCategoriesAction(data) {
    return async (dispatch) => {
        try {
            dispatch(getProductCategories());

            const response = await Api.authApi.checkIsAuth();

            if (!response.result) {
                dispatch(loginFailure({ error: response.error }));

                return;
            }

            const productCategories = await Api.productCategoriesApi.getProductCategories(data);

            if (!productCategories.result) {
                dispatch(getProductCategoriesFailure({ error: productCategories.error }));

                return;
            }

            dispatch(getProductCategoriesSuccess({ productCategories: productCategories.productCategories }));
        } catch (error) {
            dispatch(getProductCategoriesFailure({ error: error.message || error }));
        }
    };
}

export const { getProductCategories, getProductCategoriesSuccess, getProductCategoriesFailure, resetProductCategories } = productCategoriesSlice.actions;
export const productCategoriesSelector = (state) => state.productCategories;
export default productCategoriesSlice.reducer;
