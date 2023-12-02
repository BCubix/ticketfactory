import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    featureCategories: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('featureCategoriesActiveFilter')),
        name: sessionStorage.getItem('featureCategoriesNameFilter') || '',
        keyword: sessionStorage.getItem('featureCategoriesKeywordFilter') || '',
        sort: sessionStorage.getItem('featureCategoriesSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
};

const featureCategoriesSlice = createSlice({
    name: 'featureCategories',
    initialState: initialState,
    reducers: {
        getFeatureCategories: (state) => {
            state.loading = true;
        },

        getFeatureCategoriesSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.featureCategories = action.payload.featureCategories;
            state.total = action.payload.total;
        },

        getFeatureCategoriesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.featureCategories = null;
        },

        resetFeatureCategories: (state) => {
            state = { ...initialState };
        },

        updateFeatureCategoriesFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getFeatureCategoriesAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getFeatureCategories());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().featureCategories?.filters;

                const featureCategories = await Api.featureCategoriesApi.getFeatureCategories(state);
                if (!featureCategories.result) {
                    dispatch(getFeatureCategoriesFailure({ error: featureCategories.error }));

                    return;
                }

                dispatch(getFeatureCategoriesSuccess({ featureCategories: featureCategories.featureCategories, total: featureCategories.total }));
            });
        } catch (error) {
            dispatch(getFeatureCategoriesFailure({ error: error.message || error }));
        }
    };
}

export function changeFeatureCategoriesFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('featureCategoriesActiveFilter', filters?.active);
        sessionStorage.setItem('featureCategoriesNameFilter', filters?.name);
        sessionStorage.setItem('featureCategoriesKeywordFilter', filters?.keyword);
        sessionStorage.setItem('featureCategoriesSort', filters?.sort);

        filters.page = page;

        dispatch(updateFeatureCategoriesFilters({ filters: filters }));
        dispatch(getFeatureCategoriesAction(filters));
    };
}

export const { getFeatureCategories, getFeatureCategoriesSuccess, getFeatureCategoriesFailure, resetFeatureCategories, updateFeatureCategoriesFilters } =
    featureCategoriesSlice.actions;
export const featureCategoriesSelector = (state) => state.featureCategories;
export default featureCategoriesSlice.reducer;
