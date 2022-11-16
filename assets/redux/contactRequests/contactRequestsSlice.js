import { createSlice } from '@reduxjs/toolkit';
import { Api } from "@/AdminService/Api";
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    contactRequests: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('contactRequestActive')),
        firstName: sessionStorage.getItem('contactRequestFirstName') || '',
        lastName: sessionStorage.getItem('contactRequestLastName') || '',
        email: sessionStorage.getItem('contactRequestEmail') || '',
        phone: sessionStorage.getItem('contactRequestPhone') || '',
        subject: sessionStorage.getItem('contactRequestSubject') || '',
        sort: sessionStorage.getItem('contactRequestSort') || 'id ASC',
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

                const contactRequests = await Api.contactRequestsApi.getContactRequests(state);
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
        sessionStorage.setItem('contactRequestActive', filters?.active);
        sessionStorage.setItem('contactRequestFirstName', filters?.firstName);
        sessionStorage.setItem('contactRequestLastName', filters?.lastName);
        sessionStorage.setItem('contactRequestEmail', filters?.email);
        sessionStorage.setItem('contactRequestPhone', filters?.phone);
        sessionStorage.setItem('contactRequestSubject', filters?.subject);
        sessionStorage.setItem('contactRequestSort', filters?.sort);

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
