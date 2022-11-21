import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    imageFormats: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('imageFormatsActiveFilter')),
        name: sessionStorage.getItem('imageFormatsNameFilter') || '',
        sort: sessionStorage.getItem('imageFormatsSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
};

const imageFormatsSlice = createSlice({
    name: 'imageFormats',
    initialState: initialState,
    reducers: {
        getImageFormats: (state) => {
            state.loading = true;
        },

        getImageFormatsSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.imageFormats = action.payload.imageFormats;
            state.total = action.payload.total;
        },

        getImageFormatsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.imageFormats = null;
        },

        resetImageFormats: (state) => {
            state = { ...initialState };
        },

        updateImageFormatsFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getImageFormatsAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getImageFormats());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().imageFormats?.filters;

                const imageFormats = await Api.imageFormatsApi.getImageFormats(state);
                if (!imageFormats.result) {
                    dispatch(getImageFormatsFailure({ error: imageFormats.error }));

                    return;
                }

                dispatch(
                    getImageFormatsSuccess({
                        imageFormats: imageFormats.imageFormats,
                        total: imageFormats.total,
                    })
                );
            });
        } catch (error) {
            dispatch(getImageFormatsFailure({ error: error.message || error }));
        }
    };
}

export function changeImageFormatsFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('imageFormatsActiveFilter', filters?.active);
        sessionStorage.setItem('imageFormatsNameFilter', filters?.name);
        sessionStorage.setItem('imageFormatsSort', filters?.sort);

        filters.page = page;

        dispatch(updateImageFormatsFilters({ filters: filters }));
        dispatch(getImageFormatsAction(filters));
    };
}

export const {
    getImageFormats,
    getImageFormatsSuccess,
    getImageFormatsFailure,
    resetImageFormats,
    updateImageFormatsFilters,
} = imageFormatsSlice.actions;
export const imageFormatsSelector = (state) => state.imageFormats;
export default imageFormatsSlice.reducer;
