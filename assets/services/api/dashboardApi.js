import axios from './config';

const dashboardApi = {
    getDashboard: async () => {
        try {
            const result = await axios.get('/dashboard');

            return { result: true, dashboard: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getGraph: async (tab, beginDate, endDate) => {
        try {
            const result = await axios.get(
                `/dashboard?beginDate=${beginDate}&endDate${endDate}&tab=${tab}`
            );

            return { result: true, dashboard: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    updateNote: async (value) => {
        try {
            let formData = new FormData();

            formData.append('note', value);

            const result = await axios.post(`/dashboard/note`, formData);

            return { result: true, dashboard: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default dashboardApi;
