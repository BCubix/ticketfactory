import { createSlice } from '@reduxjs/toolkit';
import { loginFailure } from '../profile/profileSlice';
import authApi from '../../services/api/authApi';
import contentTypesApi from '../../services/api/contentTypesApi';

const initialState = {
    loading: false,
    error: null,
    contentTypes: null,
};

const contentTypesSlice = createSlice({
    name: 'contentTypes',
    initialState: initialState,
    reducers: {
        getContentTypes: (state) => {
            state.loading = true;
        },

        getContentTypesSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.contentTypes = action.payload.contentTypes;
        },

        getContentTypesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.contentTypes = null;
        },

        resetContentTypes: (state) => {
            state = { ...initialState };
        },
    },
});

export function getContentTypesAction(data) {
    return async (dispatch) => {
        try {
            dispatch(getContentTypes());

            const response = await authApi.checkIsAuth();

            if (!response.result) {
                dispatch(loginFailure({ error: response.error }));

                return;
            }

            const contentTypes = await contentTypesApi.getContentTypes(data);

            if (!contentTypes.result) {
                dispatch(getContentTypesFailure({ error: contentTypes.error }));

                return;
            }

            dispatch(getContentTypesSuccess({ contentTypes: contentTypes.contentTypes }));
        } catch (error) {
            dispatch(getContentTypesFailure({ error: error.message || error }));
        }
    };
}

export const {
    getContentTypes,
    getContentTypesSuccess,
    getContentTypesFailure,
    resetContentTypes,
} = contentTypesSlice.actions;
export const contentTypesSelector = (state) => state.contentTypes;
export default contentTypesSlice.reducer;
