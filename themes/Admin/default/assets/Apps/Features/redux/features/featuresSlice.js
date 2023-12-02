import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    features: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('featuresActiveFilter')),
        name: sessionStorage.getItem('featuresNameFilter') || '',
        keyword: sessionStorage.getItem('featuresKeywordFilter') || '',
        type: sessionStorage.getItem('featuresTypeFilter') || '',
        filter: getBooleanFromString(sessionStorage.getItem('featuresFilterFilter')),
        sort: sessionStorage.getItem('featuresSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
};

const featuresSlice = createSlice({
    name: 'features',
    initialState: initialState,
    reducers: {
        getFeatures: (state) => {
            state.loading = true;
        },

        getFeaturesSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.features = action.payload.features;
            state.total = action.payload.total;
        },

        getFeaturesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.features = null;
        },

        resetFeatures: (state) => {
            state = { ...initialState };
        },

        updateFeaturesFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getFeaturesAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getFeatures());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().features?.filters;

                const features = await Api.featuresApi.getFeatures(state);
                if (!features.result) {
                    dispatch(getFeaturesFailure({ error: features.error }));

                    return;
                }

                dispatch(getFeaturesSuccess({ features: features.features, total: features.total }));
            });
        } catch (error) {
            dispatch(getFeaturesFailure({ error: error.message || error }));
        }
    };
}

export function changeFeaturesFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('featuresActiveFilter', filters?.active);
        sessionStorage.setItem('featuresNameFilter', filters?.name);
        sessionStorage.setItem('featuresKeywordFilter', filters?.keyword);
        sessionStorage.setItem('featuresTypeFilter', filters?.type);
        sessionStorage.setItem('featuresFilterFilter', filters?.filter);
        sessionStorage.setItem('featuresSort', filters?.sort);

        filters.page = page;

        dispatch(updateFeaturesFilters({ filters: filters }));
        dispatch(getFeaturesAction(filters));
    };
}

export const { getFeatures, getFeaturesSuccess, getFeaturesFailure, resetFeatures, updateFeaturesFilters } = featuresSlice.actions;
export const featuresSelector = (state) => state.features;
export default featuresSlice.reducer;
