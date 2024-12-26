import axios from '@Services/api/config';

const contentHistoryApi = {
    getOneContentHistory: async (id) => {
        try {
            const result = await axios.get(`/versions/content/${id}`);

            return { result: true, contentHistory: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    restoreHistory: async (id) => {
        try {
            const result = await axios.post(`/versions/content/${id}`);

            return { result: true, contentHistory: result?.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default contentHistoryApi;
