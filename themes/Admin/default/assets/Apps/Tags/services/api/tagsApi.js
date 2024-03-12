import { Constant } from '@/AdminService/Constant';

import axios from '@Services/api/config';
import { copyData } from '@Services/utils/copyData';
import { createFilterParams } from '@Services/utils/createFilterParams';
import { sortTranslatedObject } from '@Services/utils/translationUtils';
import { constructFormData } from '@Services/utils/constructFormData';
import { Crud } from '@/AdminService/Crud';

var controller = null;

const tagsApi = {
    getTags: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, Crud?.tags?.list?.filtersData, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get('/tags', { params: params, signal: controller.signal });

            controller = null;

            const translatedList = sortTranslatedObject(result.data?.results);

            return { result: true, tags: translatedList, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, tags: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllTags: async (filters) => {
        try {
            let params = { 'filters[page]': 0 };

            createFilterParams(filters, Crud?.tags?.list?.filtersData, params);

            const result = await axios.get('/tags', { params: params });

            return { result: true, tags: result.data?.results, total: result?.data?.total };
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

    createTag: async (values) => {
        try {
            const result = await axios.post('/tags', constructFormData({ values, dataFields: Crud?.tags?.add?.api?.dataFields }));

            return { result: true, tag: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editTag: async (id, values) => {
        try {
            const result = await axios.post(`/tags/${id}`, constructFormData({ values, dataFields: Crud?.tags?.edit?.api?.dataFields }));

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

    getTranslated: async (id, languageId) => {
        try {
            const result = await axios.get(`/tags/${id}/translated/${languageId}`);
            let data = copyData(result?.data);

            return { result: true, tag: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default tagsApi;
