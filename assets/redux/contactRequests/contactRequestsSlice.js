import { createSlice } from '@reduxjs/toolkit';
import contactRequestsApi from '../../services/api/contactRequestsApi';
import { apiMiddleware } from '../../services/utils/apiMiddleware';
import { getBooleanFromString } from '../../services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    contactRequests: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('contactRequestActiveFilter')),
        firstName: sessionStorage.getItem('contactRequestsFirstNameFilter') || '',
        lastName: sessionStorage.getItem('contactRequestsLastNameFilter') || '',
        email: sessionStorage.getItem('contactRequestsEmailFilter') || '',
        phone: sessionStorage.getItem('contactRequestsPhoneFilter') || '',
        subject: sessionStorage.getItem('contactRequestsSubjectFilter') || '',
        sort: sessionStorage.getItem('contactRequestsSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
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
            state.total = action.payload.total;
        },

        getContactRequestsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.contactRequests = null;
        },

        resetContactRequests: (state) => {
            state = { ...initialState };
        },

        updateContactRequestsFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getContactRequestsAction(filters = null) {
    return async (dispatch, getState) => {
        try {
            dispatch(getContactRequests());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().contactRequests?.filters;

                const contactRequests = await contactRequestsApi.getContactRequests(state);
                if (!contactRequests.result) {
                    dispatch(getContactRequestsFailure({ error: contactRequests.error }));

                    return;
                }

                dispatch(
                    getContactRequestsSuccess({
                        contactRequests: contactRequests.contactRequests,
                        total: contactRequests?.total,
                    })
                );
            });
        } catch (error) {
            dispatch(getContactRequestsFailure({ error: error.message || error }));
        }
    };
}

export function changeContactRequestsFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('contactRequestsActiveFilter', filters?.active);
        sessionStorage.setItem('contactRequestsFirstNameFilter', filters?.firstName);
        sessionStorage.setItem('contactRequestsLastNameFilter', filters?.lastName);
        sessionStorage.setItem('contactRequestsEmailFilter', filters?.email);
        sessionStorage.setItem('contactRequestsPhoneFilter', filters?.phone);
        sessionStorage.setItem('contactRequestsSubjectFilter', filters?.subject);
        sessionStorage.setItem('contactRequestsSort', filters?.sort);

        filters.page = page;

        dispatch(updateContactRequestsFilters({ filters: filters }));
        dispatch(getContactRequestsAction(filters));
    };
}

export const {
    getContactRequests,
    getContactRequestsSuccess,
    getContactRequestsFailure,
    updateContactRequestsFilters,
    resetContactRequests,
} = contactRequestsSlice.actions;

export const contactRequestsSelector = (state) => state.contactRequests;

export default contactRequestsSlice.reducer;
