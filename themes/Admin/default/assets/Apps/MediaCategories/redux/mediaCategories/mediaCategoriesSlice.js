import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { loginFailure } from '@Apps/Auth/redux/profile/profileSlice';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    mediaCategories: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('mediaCategoriesActiveFilter')),
        name: sessionStorage.getItem('mediaCategoriesNameFilter') || '',
    },
};

const mediaCategoriesSlice = createSlice({
    name: 'mediaCategories',
    initialState: initialState,
    reducers: {
        getMediaCategories: (state) => {
            state.loading = true;
        },

        getMediaCategoriesSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.mediaCategories = action.payload.mediaCategories;
        },

        getMediaCategoriesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.mediaCategories = null;
        },

        resetMediaCategories: (state) => {
            state = { ...initialState };
        },

        updateMediaCategoriesFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getMediaCategoriesAction(data) {
    return async (dispatch) => {
        try {
            dispatch(getMediaCategories());

            const response = await Api.authApi.checkIsAuth();

            if (!response.result) {
                dispatch(loginFailure({ error: response.error }));

                return;
            }

            const mediaCategories = await Api.mediaCategoriesApi.getMediaCategories(data);

            if (!mediaCategories.result) {
                dispatch(getMediaCategoriesFailure({ error: mediaCategories.error }));

                return;
            }

            dispatch(getMediaCategoriesSuccess({ mediaCategories: mediaCategories.mediaCategories }));
        } catch (error) {
            dispatch(getMediaCategoriesFailure({ error: error.message || error }));
        }
    };
}

export function changeMediaCategoriesFilters(filters) {
    return async (dispatch) => {
        sessionStorage.setItem('mediaCategoriesActiveFilter', filters?.active);
        sessionStorage.setItem('mediaCategoriesNameFilter', filters?.name);

        dispatch(updateMediaCategoriesFilters({ filters: filters }));
        dispatch(getMediaCategoriesAction(filters));
    };
}

export const { getMediaCategories, getMediaCategoriesSuccess, getMediaCategoriesFailure, resetMediaCategories, updateMediaCategoriesFilters } = mediaCategoriesSlice.actions;
export const mediaCategoriesSelector = (state) => state.mediaCategories;
export default mediaCategoriesSlice.reducer;
