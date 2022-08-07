import { createSlice } from '@reduxjs/toolkit';
import authApi from '../../services/api/authApi';
import tagsApi from '../../services/api/tagsApi';
import { loginFailure } from '../profile/profileSlice';

const initialState = {
    loading: false,
    error: null,
    tags: null,
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
        },

        getTagsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.tags = null;
        },

        resetTags: (state) => {
            state = { ...initialState };
        },
    },
});

export function getTagsAction(data) {
    return async (dispatch) => {
        try {
            dispatch(getTags());

            const response = await authApi.checkIsAuth();

            if (!response.result) {
                dispatch(loginFailure({ error: response.error }));

                return;
            }

            const tags = await tagsApi.getTags(data);

            if (!tags.result) {
                dispatch(getTagsFailure({ error: tags.error }));

                return;
            }

            dispatch(getTagsSuccess({ tags: tags.tags }));
        } catch (error) {
            dispatch(getTagsFailure({ error: error.message || error }));
        }
    };
}

export const { getTags, getTagsSuccess, getTagsFailure, resetTags } = tagsSlice.actions;
export const tagsSelector = (state) => state.tags;
export default tagsSlice.reducer;
