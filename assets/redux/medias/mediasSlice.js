import { createSlice } from '@reduxjs/toolkit';
import authApi from '../../services/api/authApi';
import mediasApi from '../../services/api/mediasApi';
import { loginFailure } from '../profile/profileSlice';

const initialState = {
    loading: false,
    error: null,
    medias: null,
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
        },

        getMediasFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.medias = null;
        },

        resetMedias: (state) => {
            state = { ...initialState };
        },
    },
});

export function getMediasAction(data) {
    return async (dispatch) => {
        try {
            dispatch(getMedias());

            const response = await authApi.checkIsAuth();

            if (!response.result) {
                dispatch(loginFailure({ error: response.error }));

                return;
            }

            const medias = await mediasApi.getMedias(data);

            if (!medias.result) {
                dispatch(getMediasFailure({ error: medias.error }));

                return;
            }

            dispatch(getMediasSuccess({ medias: medias.medias }));
        } catch (error) {
            dispatch(getMediasFailure({ error: error.message || error }));
        }
    };
}

export const { getMedias, getMediasSuccess, getMediasFailure, resetMedias } = mediasSlice.actions;
export const mediasSelector = (state) => state.medias;
export default mediasSlice.reducer;
