import axios from '@Services/api/config';

const pageHistoryApi = {
    getOnePageHistory: async (id) => {
        try {
            const result = await axios.get(`/versions/page/${id}`);

            return { result: true, pageHistory: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    restoreHistory: async (id) => {
        try {
            const result = await axios.post(`/versions/page/${id}`);

            return { result: true, pageHistory: result?.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default pageHistoryApi;
