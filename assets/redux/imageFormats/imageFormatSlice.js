import { createSlice } from '@reduxjs/toolkit';
import authApi from '../../services/api/authApi';
import imageFormatsApi from '../../services/api/imageFormatsApi';
import { loginFailure } from '../profile/profileSlice';

const initialState = {
    loading: false,
    error: null,
    imageFormats: null,
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
        },

        getImageFormatsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.imageFormats = null;
        },

        resetImageFormats: (state) => {
            state = { ...initialState };
        },
    },
});

export function getImageFormatsAction(data) {
    return async (dispatch) => {
        try {
            dispatch(getImageFormats());

            const response = await authApi.checkIsAuth();

            if (!response.result) {
                dispatch(loginFailure({ error: response.error }));

                return;
            }

            const imageFormats = await imageFormatsApi.getImageFormats(data);

            if (!imageFormats.result) {
                dispatch(getImageFormatsFailure({ error: imageFormats.error }));

                return;
            }

            dispatch(getImageFormatsSuccess({ imageFormats: imageFormats.imageFormats }));
        } catch (error) {
            dispatch(getImageFormatsFailure({ error: error.message || error }));
        }
    };
}

export const {
    getImageFormats,
    getImageFormatsSuccess,
    getImageFormatsFailure,
    resetImageFormats,
} = imageFormatsSlice.actions;
export const imageFormatsSelector = (state) => state.imageFormats;
export default imageFormatsSlice.reducer;
