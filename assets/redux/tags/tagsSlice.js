import { createSlice } from '@reduxjs/toolkit';
import tagsApi from '../../services/api/tagsApi';
import { apiMiddleware } from '../../services/utils/apiMiddleware';
import { getBooleanFromString } from '../../services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    tags: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('tagsActiveFilter')),
        name: sessionStorage.getItem('tagsNameFilter') || '',
        sort: sessionStorage.getItem('tagsSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
};

const tagsSlice = createSlice({
    name: 'tags',
    initialState: initialState,
    reducers: {
        getTags: (state) => {
            state.loading = true;
        },

        getTagsSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.tags = action.payload.tags;
            state.total = action.payload.total;
        },

        getTagsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.tags = null;
        },

        resetTags: (state) => {
            state = { ...initialState };
        },

        updateTagsFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getTagsAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getTags());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().tags?.filters;

                const tags = await tagsApi.getTags(state);
                if (!tags.result) {
                    dispatch(getTagsFailure({ error: tags.error }));

                    return;
                }

                dispatch(getTagsSuccess({ tags: tags.tags, total: tags.total }));
            });
        } catch (error) {
            dispatch(getTagsFailure({ error: error.message || error }));
        }
    };
}

export function changeTagsFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('tagsActiveFilter', filters?.active);
        sessionStorage.setItem('tagsNameFilter', filters?.name);
        sessionStorage.setItem('tagsSort', filters?.sort);

        filters.page = page;

        dispatch(updateTagsFilters({ filters: filters }));
        dispatch(getTagsAction(filters));
    };
}

export const { getTags, getTagsSuccess, getTagsFailure, resetTags, updateTagsFilters } =
    tagsSlice.actions;
export const tagsSelector = (state) => state.tags;
export default tagsSlice.reducer;
