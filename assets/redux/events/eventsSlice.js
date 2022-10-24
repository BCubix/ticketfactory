import { createSlice } from '@reduxjs/toolkit';
import eventsApi from '../../services/api/eventsApi';
import { apiMiddleware } from '../../services/utils/apiMiddleware';
import { getBooleanFromString } from '../../services/utils/getBooleanFromString';

const initialState = {
    loading: false,
    error: null,
    events: null,
    total: null,
    filters: {
        active: getBooleanFromString(sessionStorage.getItem('eventsActiveFilter')),
        name: sessionStorage.getItem('eventsNameFilter') || '',
        category: sessionStorage.getItem('eventsCategoryFilter') || '',
        room: sessionStorage.getItem('eventsRoomFilter') || '',
        season: sessionStorage.getItem('eventsSeasonFilter') || '',
        tags: sessionStorage.getItem('eventsTagsFilter') || '',
        sort: sessionStorage.getItem('eventsSort') || 'id ASC',
        page: 1,
        limit: 20,
    },
};

const eventsSlice = createSlice({
    name: 'events',
    initialState: initialState,
    reducers: {
        getEvents: (state) => {
            state.loading = true;
        },

        getEventsSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.events = action.payload.events;
            state.total = action.payload.total;
        },

        getEventsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.events = null;
        },

        resetEvents: (state) => {
            state = { ...initialState };
        },

        updateEventsFilters: (state, action) => {
            state.filters = action.payload.filters;
        },
    },
});

export function getEventsAction(filters) {
    return async (dispatch, getState) => {
        try {
            dispatch(getEvents());

            apiMiddleware(dispatch, async () => {
                const state = filters || getState().contents?.filters;

                const events = await eventsApi.getEvents(state);

                if (!events.result) {
                    dispatch(getEventsFailure({ error: events.error }));

                    return;
                }

                dispatch(getEventsSuccess({ events: events.events, total: events.total }));
            });
        } catch (error) {
            dispatch(getEventsFailure({ error: error.message || error }));
        }
    };
}

export function changeEventsFilters(filters, page = 1) {
    return async (dispatch) => {
        console.log(filters);

        sessionStorage.setItem('eventsActiveFilter', filters?.active);
        sessionStorage.setItem('eventsNameFilter', filters?.name);
        sessionStorage.setItem('eventsCategoryFilter', filters?.category);
        sessionStorage.setItem('eventsRoomFilter', filters?.room);
        sessionStorage.setItem('eventsSeasonFilter', filters?.season);
        sessionStorage.setItem('eventsTagsFilter', filters?.tags);
        sessionStorage.setItem('eventsSort', filters?.sort);

        filters.page = page;

        console.log(filters);

        dispatch(updateEventsFilters({ filters: filters }));
        dispatch(getEventsAction(filters));
    };
}

export const { getEvents, getEventsSuccess, getEventsFailure, resetEvents, updateEventsFilters } =
    eventsSlice.actions;
export const eventsSelector = (state) => state.events;
export default eventsSlice.reducer;
