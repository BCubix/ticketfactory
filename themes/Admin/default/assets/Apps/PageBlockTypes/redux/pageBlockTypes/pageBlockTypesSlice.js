import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

const initialState = {
    loading: false,
    error: null,
    pageBlockTypes: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('pageBlockTypesActiveFilter')),
        name: sessionStorage.getItem('pageBlockTypesNameFilter') || '',
        sort: sessionStorage.getItem('pageBlockTypesSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
};

const pageBlockTypesSlice = createSlice({
    name: 'pageBlockTypes',
    initialState: initialState,
    reducers: {
        getPageBlockTypes: (state) => {
            state.loading = true;
        },

        getPageBlockTypesSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.pageBlockTypes = action.payload.pageBlockTypes;
            state.total = action.payload.total;
        },

        getPageBlockTypesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.pageBlockTypes = null;
        },

        resetPageBlockTypes: (state) => {
            state = { ...initialState };
        },

        updatePageBlockTypesFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getPageBlockTypesAction(filters = null) {
    return async (dispatch, getState) => {
        try {
            dispatch(getPageBlockTypes());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().pageBlockTypes?.filters;

                const pageBlockTypes = await Api.pageBlockTypesApi.getPageBlockTypes(state);

                if (!pageBlockTypes.result) {
                    dispatch(getPageBlockTypesFailure({ error: pageBlockTypes.error }));

                    return;
                }

                dispatch(
                    getPageBlockTypesSuccess({
                        pageBlockTypes: pageBlockTypes.pageBlockTypes,
                        total: pageBlockTypes.total,
                    })
                );
            });
        } catch (error) {
            dispatch(getPageBlockTypesFailure({ error: error.message || error }));
        }
    };
}

export function changePageBlockTypesFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('pageBlockTypesActiveFilter', filters?.active);
        sessionStorage.setItem('pageBlockTypesNameFilter', filters?.name);
        sessionStorage.setItem('pageBlockTypesSort', filters?.sort);

        filters.page = page;

        dispatch(updatePageBlockTypesFilters({ filters: filters }));
        dispatch(getPageBlockTypesAction(filters));
    };
}

export const { getPageBlockTypes, getPageBlockTypesSuccess, getPageBlockTypesFailure, resetPageBlockTypes, updatePageBlockTypesFilters } = pageBlockTypesSlice.actions;
export const pageBlockTypesSelector = (state) => state.pageBlockTypes;
export default pageBlockTypesSlice.reducer;
