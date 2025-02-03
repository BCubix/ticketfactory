import axios from '@Services/api/config';

const salesStatsApi = {
    getGraph: async (beginDate, endDate) => {
        try {
            let result;
            if (endDate === null && beginDate == null)
            {
                result = await axios.get(`/salesStats`);
            }
            else
            {
                result = await axios.get(
                    `/salesStats?beginDate=${beginDate}&endDate=${endDate}`
                );
            }
        
            return { result: true, salesStats: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

};

export default salesStatsApi;