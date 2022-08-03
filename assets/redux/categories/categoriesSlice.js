import { createSlice } from '@reduxjs/toolkit';
import authApi from '../../services/api/authApi';
import categoriesApi from '../../services/api/categoriesApi';
import { loginFailure } from '../profile/profileSlice';

const initialState = {
    loading: false,
    error: null,
    categories: null,
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState: initialState,
    reducers: {
        getCategories: (state) => {
            state.loading = true;
        },

        getCategoriesSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.categories = action.payload.categories;
        },

        getCategoriesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.categories = null;
        },

        resetCategories: (state) => {
            state = { ...initialState };
        },
    },
});

export function getCategoriesAction(data) {
    return async (dispatch) => {
        try {
            dispatch(getCategories());

            const response = await authApi.checkIsAuth();

            if (!response.result) {
                dispatch(loginFailure({ error: response.error }));

                return;
            }

            const categories = await categoriesApi.getCategories(data);

            if (!categories.result) {
                dispatch(getCategoriesFailure({ error: categories.error }));

                return;
            }

            dispatch(getCategoriesSuccess({ categories: categories.categories }));
        } catch (error) {
            dispatch(getCategoriesFailure({ error: error.message || error }));
        }
    };
}

export const { getCategories, getCategoriesSuccess, getCategoriesFailure, resetCategories } =
    categoriesSlice.actions;
export const categoriesSelector = (state) => state.categories;
export default categoriesSlice.reducer;
