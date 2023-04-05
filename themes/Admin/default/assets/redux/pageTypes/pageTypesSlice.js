import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

const initialState = {
    loading: false,
    error: null,
    pageTypes: null,
    total: null,
    filters: {
        pageType: true,
        active: getBooleanFromString(sessionStorage.getItem('pageTypesActiveFilter')),
        name: sessionStorage.getItem('pageTypesNameFilter') || '',
        sort: sessionStorage.getItem('pageTypesSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
};

const pageTypesSlice = createSlice({
    name: 'pageTypes',
    initialState: initialState,
    reducers: {
        getPageTypes: (state) => {
            state.loading = true;
        },

        getPageTypesSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.pageTypes = action.payload.pageTypes;
            state.total = action.payload.total;
        },

        getPageTypesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.pageTypes = null;
        },

        resetPageTypes: (state) => {
            state = { ...initialState };
        },

        updatePageTypesFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getPageTypesAction(filters = null) {
    return async (dispatch, getState) => {
        try {
            dispatch(getPageTypes());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().pageTypes?.filters;

                const pageTypes = await Api.contentTypesApi.getContentTypes(state);

                if (!pageTypes.result) {
                    dispatch(getPageTypesFailure({ error: pageTypes.error }));

                    return;
                }

                dispatch(
                    getPageTypesSuccess({
                        pageTypes: pageTypes.contentTypes,
                        total: pageTypes.total,
                    })
                );
            });
        } catch (error) {
            dispatch(getPageTypesFailure({ error: error.message || error }));
        }
    };
}

export function changePageTypesFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('pageTypesActiveFilter', filters?.active);
        sessionStorage.setItem('pageTypesNameFilter', filters?.name);
        sessionStorage.setItem('pageTypesSort', filters?.sort);

        filters.page = page;

        dispatch(updatePageTypesFilters({ filters: filters }));
        dispatch(getPageTypesAction(filters));
    };
}

export const { getPageTypes, getPageTypesSuccess, getPageTypesFailure, resetPageTypes, updatePageTypesFilters } = pageTypesSlice.actions;
export const pageTypesSelector = (state) => state.pageTypes;
export default pageTypesSlice.reducer;
