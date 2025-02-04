import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';

const initialState = {
    loadingCalendar: false,
    tooltip: null,
    errorCalendar: null,
    calendar: null,
};

const calendarSlice = createSlice({
    name: 'calendar',
    initialState: initialState,
    reducers: {
        getCalendar: (state) => {
            state.loadingCalendar = true;
        },

        getCalendarSuccess: (state, action) => {
            state.loadingCalendar = false;
            state.errorCalendar = null;
            state.tooltip = action.payload.tooltip
            state.calendar = action.payload.calendar;
        },

        getCalendarFailure: (state, action) => {
            state.loadingCalendar = false;
            state.errorCalendar = action.payload.error;
            state.calendar = null;
        },

        resetCalendar: (state) => {
            state = { ...initialState };
        },
    },
});

export function getCalendarAction() {
    return async (dispatch) => {
        try {
            
            dispatch(getCalendar());

            const calendar = await Api.calendarApi.getCalendar();
            const tooltip = await Api.calendarApi.getTooltip();
            
            if (!calendar.result || !tooltip.result) {
                dispatch(getCalendarFailure({ error: calendar.error }));

                return;
            }

            dispatch(getCalendarSuccess({ calendar: calendar.calendar, tooltip: tooltip.tooltip }));
        } catch (error) {
            dispatch(getCalendarFailure({ error: error.message || error }));
        }
    };
}

export const { getCalendar, getCalendarSuccess, getCalendarFailure, resetCalendar } = calendarSlice.actions;
export const calendarSelector = (state) => state.calendar;
export default calendarSlice.reducer;

