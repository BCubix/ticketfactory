import axios from '@Services/api/config';

const generalInfosApi = {
    getGraph: async () => {
        const result = await axios.get(`/generalInfos`);
        return result;
    },

};

export default generalInfosApi;
