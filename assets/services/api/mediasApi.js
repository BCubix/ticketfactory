import axios from './config';

const mediasApi = {
    getMedias: async () => {
        try {
            const result = await axios.get('/medias');

            return { result: true, medias: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneMedia: async (id) => {
        try {
            const result = await axios.get(`/medias/${id}`);

            return { result: true, media: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    // @Todo: create Media particular function
    createMedia: async (data) => {
        try {
            const result = await axios.post('/medias', formData);

            return { result: true, media: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    // @Todo: edit Media
    editMedia: async (id, data) => {
        try {
            const result = await axios.post(`/medias/${id}`, formData);

            return { result: true, media: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteMedia: async (id) => {
        try {
            await axios.delete(`/medias/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default mediasApi;
