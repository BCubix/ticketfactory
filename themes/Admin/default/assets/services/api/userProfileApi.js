import axios from '@Services/api/config';

const userProfileApi = {
    getProfile: async () => {
        try {
            const result = await axios.get('/user-profile');

            return { result: true, userProfile: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default userProfileApi;
