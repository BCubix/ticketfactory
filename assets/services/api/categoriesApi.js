import axios from './config';

const categoriesApi = {
    getCategories: async () => {
        try {
            const result = await axios.get('/event-categories');

            return { result: true, categories: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneCategory: async (id) => {
        try {
            const result = await axios.get(`/event-categories/${id}`);

            return { result: true, category: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createCategory: async (data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('name', data.name);
            formData.append('parent', data.parent);

            const result = await axios.post('/event-categories', formData);

            return { result: true, category: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editCategory: async (id, data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('name', data.name);
            formData.append('parent', data.parent);

            const result = await axios.post(`/event-categories/${id}`, formData);

            return { result: true, category: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteCategory: async (id, deleteEvent) => {
        try {
            await axios.delete(`/event-categories/${id}?deleteEvent=${deleteEvent ? 1 : 0}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default categoriesApi;
