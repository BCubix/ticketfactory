import axios from '@Services/api/config';

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

    updateNote: async (noteData) => {
        try {
            let formData = new FormData();

            for (const key in noteData) {
                formData.append(key, noteData[key]);
            }
            
            const result = await axios.post('/api/note', noteData);
               

            return { result: true, note: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

};

export default dashboardApi;
