import axios from './config';

const redirectionsApi = {
    getRedirections: async () => {
        try {
            const result = await axios.get('/redirections');

            return { result: true, redirections: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneRedirection: async (id) => {
        try {
            const result = await axios.get(`/redirections/${id}`);

            return { result: true, redirection: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createRedirection: async (data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('redirectType', data.redirectType);
            formData.append('redirectFrom', data.redirectFrom);
            formData.append('redirectTo', data.redirectTo);

            const result = await axios.post('/redirections', formData);

            return { result: true, redirection: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editRedirection: async (id, data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('redirectType', data.redirectType);
            formData.append('redirectFrom', data.redirectFrom);
            formData.append('redirectTo', data.redirectTo);

            const result = await axios.post(`/redirections/${id}`, formData);

            return { result: true, redirection: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteRedirection: async (id) => {
        try {
            await axios.delete(`/redirections/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default redirectionsApi;
