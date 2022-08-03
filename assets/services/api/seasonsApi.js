import axios from './config';

const seasonsApi = {
    getSeasons: async () => {
        try {
            const result = await axios.get('/seasons');

            return { result: true, seasons: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneSeason: async (id) => {
        try {
            const result = await axios.get(`/seasons/${id}`);

            return { result: true, season: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createSeason: async (data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('name', data.name);
            formData.append('beginYear', data.beginYear);

            const result = await axios.post('/seasons', formData);

            return { result: true, season: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editSeason: async (id, data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('name', data.name);
            formData.append('beginYear', data.beginYear);

            const result = await axios.post(`/seasons/${id}`, formData);

            return { result: true, season: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteSeason: async (id) => {
        try {
            await axios.delete(`/seasons/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default seasonsApi;
