import { createSlice } from '@reduxjs/toolkit';
import { loginFailure } from '../profile/profileSlice';
import authApi from '../../services/api/authApi';
import contentTypesApi from '../../services/api/contentTypesApi';
import { getBooleanFromString } from '../../services/utils/getBooleanFromString';
import { apiMiddleware } from '../../services/utils/apiMiddleware';

const initialState = {
    loading: false,
    error: null,
    contentTypes: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('contentTypesActiveFilter')),
        name: sessionStorage.getItem('contentTypesNameFilter') || '',
        sort: sessionStorage.getItem('contentsSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
};

const contentTypesSlice = createSlice({
    name: 'contentTypes',
    initialState: initialState,
    reducers: {
        getContentTypes: (state) => {
            state.loading = true;
        },

        getContentTypesSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.contentTypes = action.payload.contentTypes;
            state.total = action.payload.total;
        },

        getContentTypesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.contentTypes = null;
        },

        resetContentTypes: (state) => {
            state = { ...initialState };
        },

        updateContentTypesFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getContentTypesAction(filters = null) {
    return async (dispatch, getState) => {
        try {
            dispatch(getContentTypes());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().contentTypes?.filters;

                const contentTypes = await contentTypesApi.getContentTypes(state);

                if (!contentTypes.result) {
                    dispatch(getContentTypesFailure({ error: contentTypes.error }));

                    return;
                }

                dispatch(
                    getContentTypesSuccess({
                        contentTypes: contentTypes.contentTypes,
                        total: contentTypes.total,
                    })
                );
            });
        } catch (error) {
            dispatch(getContentTypesFailure({ error: error.message || error }));
        }
    };
}

export function changeContentTypesFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('contentTypesActiveFilter', filters?.active);
        sessionStorage.setItem('contentTypesNameFilter', filters?.name);
        sessionStorage.setItem('contentTypesSort', filters?.sort);

        filters.page = page;

        dispatch(updateContentTypesFilters({ filters: filters }));
        dispatch(getContentTypesAction(filters));
    };
}

export const {
    getContentTypes,
    getContentTypesSuccess,
    getContentTypesFailure,
    resetContentTypes,
    updateContentTypesFilters,
} = contentTypesSlice.actions;
export const contentTypesSelector = (state) => state.contentTypes;
export default contentTypesSlice.reducer;
