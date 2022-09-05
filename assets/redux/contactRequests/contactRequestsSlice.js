import { createSlice } from '@reduxjs/toolkit';
import authApi from '../../services/api/authApi';
import contactRequestsApi from '../../services/api/contactRequestsApi';
import { loginFailure } from '../profile/profileSlice';

const initialState = {
    loading: false,
    error: null,
    contactRequests: null,
};

const contactRequestsSlice = createSlice({
    name: 'contactsRequests',
    initialState: initialState,
    reducers: {
        getContactRequests: (state) => {
            state.loading = true;
        },

        getContactRequestsSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.contactRequests = action.payload.contactRequests;
        },

        getContactRequestsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.contactRequests = null;
        },

        resetContactRequests: (state) => {
            state = { ...initialState };
        },
    },
});

export function getContactRequestsAction(data) {
    return async (dispatch) => {
        try {
            dispatch(getContactRequests());

            const response = await authApi.checkIsAuth();

            if (!response.result) {
                dispatch(loginFailure({ error: response.error }));

                return;
            }

            const contactRequests = await contactRequestsApi.getContactRequests(data);

            if (!contactRequests.result) {
                dispatch(getContactRequestsFailure({ error: contactRequests.error }));

                return;
            }

            dispatch(
                getContactRequestsSuccess({ contactRequests: contactRequests.contactRequests })
            );
        } catch (error) {
            dispatch(getContactRequestsFailure({ error: error.message || error }));
        }
    };
}

export const {
    getContactRequests,
    getContactRequestsSuccess,
    getContactRequestsFailure,
    resetContactRequests,
} = contactRequestsSlice.actions;

export const contactRequestsSelector = (state) => state.contactRequests;

export default contactRequestsSlice.reducer;
