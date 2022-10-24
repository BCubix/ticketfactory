import axios from './config';

const logsApi = {
    getLogs: async () => {
        try {
            const result = await axios.get('/logs');

            return { result: true, logs: result.data?.results };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default logsApi;
