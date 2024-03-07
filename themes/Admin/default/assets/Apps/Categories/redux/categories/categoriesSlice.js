import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

const initialState = {
    loading: false,
    error: null,
    categories: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('categoriesActiveFilter')),
        name: sessionStorage.getItem('categoriesNameFilter') || '',
    },
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

        updateCategoriesFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getCategoriesAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getCategories());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().categories?.filters;

                const categories = await Api.categoriesApi.getCategories(state);
                if (!categories.result) {
                    dispatch(getCategoriesFailure({ error: categories.error }));
                    return;
                }

                dispatch(getCategoriesSuccess({ categories: categories.categories }));
            });
        } catch (error) {
            dispatch(getCategoriesFailure({ error: error.message || error }));
        }
    };
}

export function changeCategoriesFilters(filters) {
    return async (dispatch) => {
        sessionStorage.setItem('categoriesActiveFilter', filters?.active);
        sessionStorage.setItem('categoriesNameFilter', filters?.name);

        dispatch(updateCategoriesFilters({ filters: filters }));
        dispatch(getCategoriesAction(filters));
    };
}

export const { getCategories, getCategoriesSuccess, getCategoriesFailure, resetCategories, updateCategoriesFilters } = categoriesSlice.actions;
export const categoriesSelector = (state) => state.categories;
export default categoriesSlice.reducer;
