import axios from '@Services/api/config';

const milestonesApi = {
    getMilestones: async () => {
        try {
            const result = await axios.get("/milestones");

            return { result: true, milestones: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

};

export default milestonesApi;