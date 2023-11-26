import axios from '@Services/api/config';
import { copyData } from '@Services/utils/copyData';
import { sortTranslatedCategory } from '../../../../services/utils/translationUtils';
import { constructFormData } from '@Services/utils/constructFormData';
import { Crud } from '@/AdminService/Crud';

const categoriesApi = {
    getCategories: async (filters) => {
        try {
            let params = {};

            if (filters?.lang) {
                params['filters[lang]'] = filters?.lang;
            }

            const result = await axios.get('/event-categories', { params: params });

            let data = sortTranslatedCategory(result.data);

            return { result: true, categories: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneCategory: async (id) => {
        try {
            const result = await axios.get(`/event-categories/${id}`);

            let data = sortTranslatedCategory(result.data);

            return { result: true, category: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createCategory: async (values) => {
        try {
            const result = await axios.post('/event-categories', constructFormData({ values, dataFields: Crud?.categories?.add?.api?.dataFields }));

            return { result: true, category: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editCategory: async (id, values) => {
        try {
            const result = await axios.post(`/event-categories/${id}`, constructFormData({ values, dataFields: Crud?.categories?.edit?.api?.dataFields }));

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

    orderCategories: async (id, srcPosition, destPosition) => {
        try {
            await axios.post(`/event-categories/${id}/order?src=${srcPosition}&dest=${destPosition}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default categoriesApi;
