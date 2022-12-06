import axios from '@Services/api/config';

const themesApi = {
    getThemes: async (filters) => {
        try {
            const result = await axios.get('/themes');

            return { result: true, themes: result?.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneTheme: async (id) => {
        try {
            const result = await axios.get(`/themes/${id}`);

            return { result: true, theme: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    activeTheme: async (name) => {
        try {
            await axios.post(`/themes/${name}/active`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteTheme: async (name) => {
        try {
            await axios.delete(`/themes/${name}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default themesApi;
