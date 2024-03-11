import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    ticketing: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('ticketingActiveFilter')),
        name: sessionStorage.getItem('ticketingNameFilter') || '',
        sort: sessionStorage.getItem('ticketingSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
};

const ticketingSlice = createSlice({
    name: 'ticketing',
    initialState: initialState,
    reducers: {
        getTicketing: (state) => {
            state.loading = true;
        },

        getTicketingSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.ticketing = action.payload.ticketing;
            state.total = action.payload.total;
        },

        getTicketingFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.ticketing = null;
        },

        resetTicketing: (state) => {
            state = { ...initialState };
        },

        updateTicketingFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getTicketingAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getTicketing());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().ticketing?.filters;

                const ticketing = await Api.ticketingApi.getTicketing(state);
                if (!ticketing.result) {
                    dispatch(getTicketingFailure({ error: ticketing.error }));

                    return;
                }

                dispatch(getTicketingSuccess({ ticketing: ticketing.ticketing, total: ticketing.total }));
            });
        } catch (error) {
            dispatch(getTicketingFailure({ error: error.message || error }));
        }
    };
}

export function changeTicketingFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('ticketingActiveFilter', filters?.active);
        sessionStorage.setItem('ticketingNameFilter', filters?.name);
        sessionStorage.setItem('ticketingSort', filters?.sort);

        filters.page = page;

        dispatch(updateTicketingFilters({ filters: filters }));
        dispatch(getTicketingAction(filters));
    };
}

export const { getTicketing, getTicketingSuccess, getTicketingFailure, resetTicketing, updateTicketingFilters } = ticketingSlice.actions;
export const ticketingSelector = (state) => state.ticketing;
export default ticketingSlice.reducer;
