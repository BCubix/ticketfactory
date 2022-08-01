import axios from './config';

const usersApi = {
    getUsers: async () => {
        try {
            const result = await axios.get('/users');

            return { result: true, users: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createUser: async (data) => {
        try {
            const result = await axios.post('/users', { data });

            console.log(result);

            return { result: true, users: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default usersApi;
