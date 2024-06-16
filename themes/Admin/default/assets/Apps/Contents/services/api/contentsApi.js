import { Constant } from '@/AdminService/Constant';

import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';
import { copyData } from '@Services/utils/copyData';
import { sortTranslatedObject } from '@Services/utils/translationUtils';
import { Crud } from '@/AdminService/Crud';
import { constructFormData } from '@Services/utils/constructFormData';

var controller = null;

const contentsApi = {
    getContents: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, Crud?.contents?.list?.filtersData, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get('/contents', {
                params: params,
                signal: controller.signal,
            });

            controller = null;

            const translatedList = sortTranslatedObject(result.data?.results);

            return { result: true, contents: translatedList, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, contents: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllContents: async (filters) => {
        try {
            let params = { 'filters[page]': 0 };

            createFilterParams(filters, Crud?.contents?.list?.filtersData, params);

            const result = await axios.get('/contents', {
                params: params,
            });

            return { result: true, contents: result.data?.results, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, contents: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getOneContent: async (id) => {
        try {
            const result = await axios.get(`/contents/${id}`);
            const data = copyData(result?.data);

            return { result: true, content: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createContent: async (values) => {
        try {
            const result = await axios.post(`/contents/${values.contentType}/create`, constructFormData({ values, dataFields: Crud?.contents?.add?.api?.dataFields }));

            return { result: true, content: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editContent: async (id, values) => {
        try {
            const result = await axios.post(`/contents/${id}/edit`, constructFormData({ values, dataFields: Crud?.contents?.edit?.api?.dataFields }));

            return { result: true, content: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteContent: async (id) => {
        try {
            await axios.delete(`/contents/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    duplicateContent: async (id) => {
        try {
            await axios.post(`/contents/${id}/duplicate`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getTranslated: async (id, languageId) => {
        try {
            const result = await axios.get(`/contents/${id}/translated/${languageId}`);
            const data = copyData(result?.data);

            return { result: true, content: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getAvailable: async (id) => {
        try {
            const result = await axios.get(`/contents/${id}/availableContent`);

            return { result: true, number: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getContentByPageId: async (id) => {
        try {
            const result = await axios.get(`/contents/${id}/page`);

            return { result: true, content: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default contentsApi;
