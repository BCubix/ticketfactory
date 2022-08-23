import axios from './config';

const imageFormatsApi = {
    getImageFormats: async () => {
        try {
            const result = await axios.get('/image-formats');

            return { result: true, imageFormats: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneImageFormat: async (id) => {
        try {
            const result = await axios.get(`/image-formats/${id}`);

            return { result: true, imageFormat: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createImageFormat: async (data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('name', data.name);
            formData.append('length', data.length);
            formData.append('height', data.height);

            const result = await axios.post('/image-formats', formData);

            return { result: true, imageFormat: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editImageFormat: async (id, data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('name', data.name);
            formData.append('length', data.length);
            formData.append('height', data.height);

            const result = await axios.post(`/image-formats/${id}`, formData);

            return { result: true, imageFormat: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteImageFormat: async (id) => {
        try {
            await axios.delete(`/image-formats/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default imageFormatsApi;
