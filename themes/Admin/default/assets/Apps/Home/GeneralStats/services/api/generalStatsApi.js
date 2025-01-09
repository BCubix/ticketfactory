import axios from '@Services/api/config';

const generalStatsApi = {
    getGraph: async (beginDate, endDate) => {
        let result;
        if (endDate === null && beginDate == null)
        {
            result = await axios.get(`/clientVisit`);
        }
        else
        {
            result = await axios.get(
                `/clientVisit?beginDate=${beginDate}&endDate=${endDate}`
            );
        }
        
        return result;
    },

};

export default generalStatsApi;
