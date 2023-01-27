import { createSlice } from '@reduxjs/toolkit';
import { Api } from "@/AdminService/Api";
import { loginFailure } from "@Redux/profile/profileSlice";

const initialState = {
    loading: false,
    error: null,
    mediaCategories: null,
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

export const { getMediaCategories, getMediaCategoriesSuccess, getMediaCategoriesFailure, resetMediaCategories } =
    mediaCategoriesSlice.actions;
export const mediaCategoriesSelector = (state) => state.mediaCategories;
export default mediaCategoriesSlice.reducer;
