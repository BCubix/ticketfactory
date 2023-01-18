import axios from '@Services/api/config';
import { changeSlug } from '@Services/utils/changeSlug';
import { copyData } from '@Services/utils/copyData';

const categoriesApi = {
    getCategories: async (filters) => {
        try {
            let params = {};

            if (filters?.lang) {
                params['filters[lang]'] = filters?.lang;
            }

            const result = await axios.get('/event-categories', { params: params });

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
            formData.append('slug', changeSlug(data.slug));
            formData.append('lang', data.lang);
            formData.append('languageGroup', data.languageGroup);

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
            formData.append('slug', changeSlug(data.slug));
            formData.append('lang', data.lang);
            formData.append('languageGroup', data.languageGroup);

            const result = await axios.post(`/event-categories/${id}`, formData);

            return { result: true, category: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteCategory: async (id, deleteEvents) => {
        try {
            await axios.delete(`/event-categories/${id}?deleteEvents=${deleteEvents ? 1 : 0}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    duplicateCategory: async (id) => {
        try {
            await axios.post(`/event-categories/${id}/duplicate`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getTranslated: async (id, languageId) => {
        try {
            const result = await axios.get(`/event-categories/${id}/translated/${languageId}`);
            const data = copyData(result?.data);

            return { result: true, category: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default categoriesApi;
