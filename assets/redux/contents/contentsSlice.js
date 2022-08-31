import { createSlice } from '@reduxjs/toolkit';
import { loginFailure } from '../profile/profileSlice';
import authApi from '../../services/api/authApi';
import contentsApi from '../../services/api/contentsApi';

const initialState = {
    loading: false,
    error: null,
    contents: null,
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
        },

        getContentsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.contents = null;
        },

        resetContents: (state) => {
            state = { ...initialState };
        },
    },
});

export function getContentsAction(data) {
    return async (dispatch) => {
        try {
            dispatch(getContents());

            const response = await authApi.checkIsAuth();

            if (!response.result) {
                dispatch(loginFailure({ error: response.error }));

                return;
            }

            const contents = await contentsApi.getContents(data);

            if (!contents.result) {
                dispatch(getContentsFailure({ error: contents.error }));

                return;
            }

            dispatch(getContentsSuccess({ contents: contents.contents }));
        } catch (error) {
            dispatch(getContentsFailure({ error: error.message || error }));
        }
    };
}

export const { getContents, getContentsSuccess, getContentsFailure, resetContents } =
    contentsSlice.actions;
export const contentsSelector = (state) => state.contents;
export default contentsSlice.reducer;
