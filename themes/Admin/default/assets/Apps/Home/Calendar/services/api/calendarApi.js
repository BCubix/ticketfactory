import axios from '@Services/api/config';

const calendarApi = {
    getCalendar: async () => {
        try {
            const result = await axios.get("/eventDatesSlots");

            return { result: true, calendar: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
    
    getTooltip: async () => {
        try {
            const result = await axios.get("/eventDatesTooltip");

            return { result: true, tooltip: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

};

export default calendarApi;
