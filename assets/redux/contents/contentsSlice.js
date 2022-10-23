import { createSlice } from '@reduxjs/toolkit';
import contentsApi from '../../services/api/contentsApi';
import { getBooleanFromString } from '../../services/utils/getBooleanFromString';
import { apiMiddleware } from '../../services/utils/apiMiddleware';

const initialState = {
    loading: false,
    error: null,
    contents: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('contentsActiveFilter')),
        title: sessionStorage.getItem('contentsTitleFilter') || '',
        contentType: sessionStorage.getItem('contentsContentTypeFilter') || '',
        sort: sessionStorage.getItem('contentsSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
};

const contentsSlice = createSlice({
    name: 'contents',
    initialState: initialState,
    reducers: {
        getContents: (state) => {
            state.loading = true;
        },

        getContentsSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.contents = action.payload.contents;
            state.total = action.payload.total;
        },

        getContentsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.contents = null;
        },

        resetContents: (state) => {
            state = { ...initialState };
        },

        updateContentsFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getContentsAction(filters = null) {
    return async (dispatch, getState) => {
        try {
            dispatch(getContents());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().contents?.filters;

                const contents = await contentsApi.getContents(state);

                if (!contents.result) {
                    dispatch(getContentsFailure({ error: contents.error }));

                    return;
                }

                dispatch(
                    getContentsSuccess({ contents: contents.contents, total: contents?.total })
                );
            });
        } catch (error) {
            dispatch(getContentsFailure({ error: error.message || error }));
        }
    };
}

export function changeContentsFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('contentsActiveFilter', filters?.active);
        sessionStorage.setItem('contentsTitleFilter', filters?.title);
        sessionStorage.setItem('contentsContentTypeFilter', filters?.contentType);
        sessionStorage.setItem('contentsSort', filters?.sort);

        filters.page = page;

        dispatch(updateContentsFilters({ filters: filters }));
        dispatch(getContentsAction(filters));
    };
}

export const {
    getContents,
    getContentsSuccess,
    getContentsFailure,
    resetContents,
    updateContentsFilters,
} = contentsSlice.actions;
export const contentsSelector = (state) => state.contents;
export default contentsSlice.reducer;
