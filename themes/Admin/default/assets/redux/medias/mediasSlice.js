import { createSlice } from '@reduxjs/toolkit';
import { Api } from "@/AdminService/Api";
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    medias: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('mediasActiveFilter')),
        title: sessionStorage.getItem('mediasTitleFilter') || '',
        sort: sessionStorage.getItem('mediasSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
};

const mediasSlice = createSlice({
    name: 'medias',
    initialState: initialState,
    reducers: {
        getMedias: (state) => {
            state.loading = true;
        },

        getMediasSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.medias = action.payload.medias;
            state.total = action.payload.total;
        },

        getMediasFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.medias = null;
        },

        resetMedias: (state) => {
            state = { ...initialState };
        },

        updateMediasFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getMediasAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getMedias());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().medias?.filters;

                const medias = await Api.mediasApi.getMedias(state);
                if (!medias.result) {
                    dispatch(getMediasFailure({ error: medias.error }));

                    return;
                }

                dispatch(getMediasSuccess({ medias: medias.medias, total: medias.total }));
            });
        } catch (error) {
            dispatch(getMediasFailure({ error: error.message || error }));
        }
    };
}

export function changeMediasFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('mediasActiveFilter', filters?.active);
        sessionStorage.setItem('mediasTitleFilter', filters?.title);
        sessionStorage.setItem('mediasSort', filters?.sort);

        filters.page = page;

        dispatch(updateMediasFilters({ filters: filters }));
        dispatch(getMediasAction(filters));
    };
}

export const { getMedias, getMediasSuccess, getMediasFailure, resetMedias, updateMediasFilters } =
    mediasSlice.actions;
export const mediasSelector = (state) => state.medias;
export default mediasSlice.reducer;
