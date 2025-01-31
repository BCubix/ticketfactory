import axios from '@Services/api/config';

const generalStatsApi = {
    getGraph: async (beginDate, endDate) => {
        let result;
        if (endDate === null && beginDate == null)
        {
            result = await axios.get(`/generalStats`);
        }
        else
        {
            result = await axios.get(
                `/generalStats?beginDate=${beginDate}&endDate=${endDate}`
            );
        }
        
        return result;
    },

};

export default generalStatsApi;