import axios from '@Services/api/config';

const eventHistoryApi = {
    getOneEventHistory: async (id) => {
        try {
            const result = await axios.get(`/versions/event/${id}`);

            return { result: true, eventHistory: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    restoreHistory: async (id) => {
        try {
            const result = await axios.post(`/versions/event/${id}`);

            return { result: true, eventHistory: result?.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default eventHistoryApi;
