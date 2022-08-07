import axios from './config';

const tagsApi = {
    getTags: async () => {
        try {
            const result = await axios.get('/tags');

            return { result: true, tags: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneTag: async (id) => {
        try {
            const result = await axios.get(`/tags/${id}`);

            return { result: true, tag: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createTag: async (data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('name', data.name);
            formData.append('description', data.description);

            const result = await axios.post('/tags', formData);

            return { result: true, tag: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editTag: async (id, data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('name', data.name);
            formData.append('description', data.description);

            const result = await axios.post(`/tags/${id}`, formData);

            return { result: true, tag: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteTag: async (id) => {
        try {
            await axios.delete(`/tags/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default tagsApi;
