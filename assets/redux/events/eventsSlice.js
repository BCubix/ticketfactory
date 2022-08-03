import { createSlice } from '@reduxjs/toolkit';
import authApi from '../../services/api/authApi';
import eventsApi from '../../services/api/eventsApi';
import { loginFailure } from '../profile/profileSlice';

const initialState = {
    loading: false,
    error: null,
    events: null,
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
        },

        getEventsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.events = null;
        },

        resetEvents: (state) => {
            state = { ...initialState };
        },
    },
});

export function getEventsAction(data) {
    return async (dispatch) => {
        try {
            dispatch(getEvents());

            const response = await authApi.checkIsAuth();

            if (!response.result) {
                dispatch(loginFailure({ error: response.error }));

                return;
            }

            const events = await eventsApi.getEvents(data);

            if (!events.result) {
                dispatch(getEventsFailure({ error: events.error }));

                return;
            }

            dispatch(getEventsSuccess({ events: events.events }));
        } catch (error) {
            dispatch(getEventsFailure({ error: error.message || error }));
        }
    };
}

export const { getEvents, getEventsSuccess, getEventsFailure, resetEvents } = eventsSlice.actions;
export const eventsSelector = (state) => state.events;
export default eventsSlice.reducer;
