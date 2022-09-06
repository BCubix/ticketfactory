import { createSlice } from '@reduxjs/toolkit';
import authApi from '../../services/api/authApi';
import contentTypeFieldsApi from '../../services/api/contentTypeFieldsApi';
import { loginFailure } from '../profile/profileSlice';

const initialState = {
    loading: false,
    error: null,
    contentTypeFields: null,
};

const contentTypeFieldsSlice = createSlice({
    name: 'contentTypeFields',
    initialState: initialState,
    reducers: {
        getContentTypeFields: (state) => {
            state.loading = true;
        },

        getContentTypeFieldsSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.contentTypeFields = action.payload.contentTypeFields;
        },

        getContentTypeFieldsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.contentTypeFields = null;
        },

        resetContentTypeFields: (state) => {
            state = { ...initialState };
        },
    },
});

export function getContentTypeFieldsAction(data) {
    return async (dispatch) => {
        try {
            dispatch(getContentTypeFields());

            const response = await authApi.checkIsAuth();

            if (!response.result) {
                dispatch(loginFailure({ error: response.error }));

                return;
            }

            const contentTypeFields = await contentTypeFieldsApi.getContentTypeFields(data);

            if (!contentTypeFields.result) {
                dispatch(getContentTypeFieldsFailure({ error: contentTypeFields.error }));

                return;
            }

            dispatch(
                getContentTypeFieldsSuccess({
                    contentTypeFields: contentTypeFields.contentTypeFields,
                })
            );
        } catch (error) {
            dispatch(getContentTypeFieldsFailure({ error: error.message || error }));
        }
    };
}

export const {
    getContentTypeFields,
    getContentTypeFieldsSuccess,
    getContentTypeFieldsFailure,
    resetContentTypeFields,
} = contentTypeFieldsSlice.actions;
export const contentTypeFieldsSelector = (state) => state.contentTypeFields;
export default contentTypeFieldsSlice.reducer;
