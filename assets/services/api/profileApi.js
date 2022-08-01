import axios from './config';

const profileApi = {
    getProfile: async () => {
        try {
            const result = await axios.get('/profile');

            return { result: true, profile: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default profileApi;
