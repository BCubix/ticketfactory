import axios from '@Services/api/config';
import { copyData } from '@Services/utils/copyData';
import { sortTranslatedCategory } from '../../../../services/utils/translationUtils';
import { constructFormData } from '@Services/utils/constructFormData';
import { Crud } from '@/AdminService/Crud';
import { createFilterParams } from '@Services/utils/createFilterParams';

const mediaCategoriesApi = {
    getMediaCategories: async (filters) => {
        try {
            let params = {};

            if (filters?.lang) {
                params['filters[lang]'] = filters?.lang;
            }
            createFilterParams(filters, Crud?.mediaCategories?.list?.filtersData, params);

            const result = await axios.get('/media-categories', { params: params });
            let data = sortTranslatedCategory(result.data);

            return { result: true, mediaCategories: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getAllMediaCategories: async (filters) => {
        try {
            let params = { 'filters[page]': 0 };

            if (filters?.lang) {
                params['filters[lang]'] = filters?.lang;
            }
            createFilterParams(filters, Crud?.mediaCategories?.list?.filtersData, params);

            const result = await axios.get('/media-categories', { params: params });

            let data = sortTranslatedCategory(result.data);

            return { result: true, mediaCategories: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneMediaCategory: async (id, filters) => {
        try {
            let params = {};
            if (filters?.lang) {
                params['filters[lang]'] = filters?.lang;
            }

            createFilterParams(filters, Crud?.mediaCategories?.list?.filtersData, params);

            const result = await axios.get(`/media-categories/${id}`, { params: params });
            let data = sortTranslatedCategory(result.data);

            return { result: true, mediaCategory: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createMediaCategory: async (values) => {
        try {
            const result = await axios.post('/media-categories', constructFormData({ values, dataFields: Crud?.mediaCategories?.add?.api?.dataFields }));

            return { result: true, mediaCategory: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editMediaCategory: async (id, values) => {
        try {
            const result = await axios.post(`/media-categories/${id}`, constructFormData({ values, dataFields: Crud?.mediaCategories?.edit?.api?.dataFields }));

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

    orderCategories: async (id, srcPosition, destPosition) => {
        try {
            await axios.post(`/media-categories/${id}/order?src=${srcPosition}&dest=${destPosition}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default mediaCategoriesApi;
