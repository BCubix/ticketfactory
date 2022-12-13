import axios from '@Services/api/config';

const hooksApi = {
    getHooks: async () => {
        try {
            const result = await axios.get('/hooks');

            return { result: true, hooks: result?.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default hooksApi;
