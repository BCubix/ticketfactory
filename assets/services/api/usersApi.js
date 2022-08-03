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

    getOneUser: async (id) => {
        try {
            const result = await axios.get(`/users/${id}`);

            return { result: true, user: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createUser: async (data) => {
        try {
            let formData = new FormData();

            formData.append('email', data.email);
            formData.append('firstName', data.firstName);
            formData.append('lastName', data.lastName);
            formData.append('plainPassword', data.password);

            const result = await axios.post('/users', formData);

            return { result: true, user: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editUser: async (id, data) => {
        try {
            let formData = new FormData();

            formData.append('email', data.email);
            formData.append('firstName', data.firstName);
            formData.append('lastName', data.lastName);

            if (data.password) {
                formData.append('plainPassword', data.password);
            }

            const result = await axios.post(`/users/${id}`, formData);

            return { result: true, user: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteUser: async (id) => {
        try {
            await axios.delete(`/users/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default usersApi;
