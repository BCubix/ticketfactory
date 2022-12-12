import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    pageBlocks: null,
    total: null,
    filters: {
        name: sessionStorage.getItem('pageBlocksNameFilter') || '',
        sort: sessionStorage.getItem('pageBlocksSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
};

const pageBlocksSlice = createSlice({
    name: 'pageBlocks',
    initialState: initialState,
    reducers: {
        getPageBlocks: (state) => {
            state.loading = true;
        },

        getPageBlocksSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.pageBlocks = action.payload.pageBlocks;
            state.total = action.payload.total;
        },

        getPageBlocksFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.pageBlocks = null;
        },

        resetPageBlocks: (state) => {
            state = { ...initialState };
        },

        updatePageBlocksFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getPageBlocksAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getPageBlocks());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().pageBlocks?.filters;

                const pageBlocks = await Api.pageBlocksApi.getPageBlocks(state);
                if (!pageBlocks.result) {
                    dispatch(getPageBlocksFailure({ error: pageBlocks.error }));

                    return;
                }

                dispatch(getPageBlocksSuccess({ pageBlocks: pageBlocks.pageBlocks, total: pageBlocks.total }));
            });
        } catch (error) {
            dispatch(getPageBlocksFailure({ error: error.message || error }));
        }
    };
}

export function changePageBlocksFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('pageBlocksNameFilter', filters?.name);
        sessionStorage.setItem('pageBlocksSort', filters?.sort);

        filters.page = page;

        dispatch(updatePageBlocksFilters({ filters: filters }));
        dispatch(getPageBlocksAction(filters));
    };
}

export const { getPageBlocks, getPageBlocksSuccess, getPageBlocksFailure, resetPageBlocks, updatePageBlocksFilters } = pageBlocksSlice.actions;
export const pageBlocksSelector = (state) => state.pageBlocks;
export default pageBlocksSlice.reducer;
