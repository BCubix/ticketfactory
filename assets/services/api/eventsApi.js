import axios from './config';

const eventsApi = {
    getEvents: async () => {
        try {
            const result = await axios.get('/events');

            return { result: true, events: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneEvent: async (id) => {
        try {
            const result = await axios.get(`/events/${id}`);

            return { result: true, event: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createEvent: async (data) => {
        try {
            const result = await axios.post('/events', data);

            return { result: true, event: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editEvent: async (id, data) => {
        try {
            const result = await axios.post(`/events/${id}`, data);

            return { result: true, event: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteEvent: async (id) => {
        try {
            await axios.delete(`/events/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default eventsApi;
