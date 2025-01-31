import axios from '@Services/api/config';

const healthStatsApi = {
    
    getHealthStats: async (parameters, modules, addonVersions) => {
        try {
            const result = await axios.get(`/healthStatics?`);

            return { result: true, healthStats: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

};

export default healthStatsApi;
