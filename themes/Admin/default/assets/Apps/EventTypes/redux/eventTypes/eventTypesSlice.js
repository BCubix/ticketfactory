import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getBooleanFromString } from '@Services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    eventTypes: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('eventTypesActiveFilter')),
        name: sessionStorage.getItem('eventTypesNameFilter') || '',
        sort: sessionStorage.getItem('eventTypesSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
};

const eventTypesSlice = createSlice({
    name: 'eventTypes',
    initialState: initialState,
    reducers: {
        getEventTypes: (state) => {
            state.loading = true;
        },

        getEventTypesSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.eventTypes = action.payload.eventTypes;
            state.total = action.payload.total;
        },

        getEventTypesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.eventTypes = null;
        },

        resetEventTypes: (state) => {
            state = { ...initialState };
        },

        updateEventTypesFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getEventTypesAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getEventTypes());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().eventTypes?.filters;

                const eventTypes = await Api.eventTypesApi.getEventTypes(state);
                if (!eventTypes.result) {
                    dispatch(getEventTypesFailure({ error: eventTypes.error }));

                    return;
                }

                dispatch(getEventTypesSuccess({ eventTypes: eventTypes.eventTypes, total: eventTypes.total }));
            });
        } catch (error) {
            dispatch(getEventTypesFailure({ error: error.message || error }));
        }
    };
}

export function changeEventTypesFilters(filters, page = 1) {
    return async (dispatch) => {
        sessionStorage.setItem('eventTypesActiveFilter', filters?.active);
        sessionStorage.setItem('eventTypesNameFilter', filters?.name);
        sessionStorage.setItem('eventTypesSort', filters?.sort);

        filters.page = page;

        dispatch(updateEventTypesFilters({ filters: filters }));
        dispatch(getEventTypesAction(filters));
    };
}

export const { getEventTypes, getEventTypesSuccess, getEventTypesFailure, resetEventTypes, updateEventTypesFilters } = eventTypesSlice.actions;
export const eventTypesSelector = (state) => state.eventTypes;
export default eventTypesSlice.reducer;
