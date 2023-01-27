import axios from '@Services/api/config';
import { changeSlug } from '@Services/utils/changeSlug';
import { copyData } from '@Services/utils/copyData';
import { sortTranslatedCategory } from '../utils/translationUtils';

const mediaCategoriesApi = {
    getMediaCategories: async (filters) => {
        try {
            let params = {};

            if (filters?.lang) {
                params['filters[lang]'] = filters?.lang;
            }

            const result = await axios.get('/media-categories', { params: params });

            let data = sortTranslatedCategory(result.data);

            return { result: true, mediaCategories: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneMediaCategory: async (id) => {
        try {
            const result = await axios.get(`/media-categories/${id}`);

            return { result: true, mediaCategory: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createMediaCategory: async (data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('name', data.name);
            formData.append('parent', data.parent);
            formData.append('slug', changeSlug(data.slug));
            formData.append('lang', data.lang);
            formData.append('languageGroup', data.languageGroup);

            const result = await axios.post('/media-categories', formData);

            return { result: true, mediaCategory: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editMediaCategory: async (id, data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('name', data.name);
            formData.append('parent', data.parent);
            formData.append('slug', changeSlug(data.slug));
            formData.append('lang', data.lang);
            formData.append('languageGroup', data.languageGroup);

            const result = await axios.post(`/media-categories/${id}`, formData);

            return { result: true, mediaCategory: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteMediaCategory: async (id, deleteEvents) => {
        try {
            await axios.delete(`/media-categories/${id}?deleteEvents=${deleteEvents ? 1 : 0}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    duplicateMediaCategory: async (id) => {
        try {
            await axios.post(`/media-categories/${id}/duplicate`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getTranslated: async (id, languageId) => {
        try {
            const result = await axios.get(`/media-categories/${id}/translated/${languageId}`);
            const data = copyData(result?.data);

            return { result: true, mediaCategory: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default mediaCategoriesApi;
