import axios from '@Services/api/config';

const logsApi = {
    getLogs: async () => {
        try {
            let params = {
                'filters[sortField]': 'id',
                'filters[sortOrder]': 'DESC',
            };

            const result = await axios.get('/logs', { params });

            return { result: true, logs: result.data?.results };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default logsApi;
