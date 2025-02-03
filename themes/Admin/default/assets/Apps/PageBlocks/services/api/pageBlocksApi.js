import { Constant } from '@/AdminService/Constant';
import axios from '@Services/api/config';
import { copyData } from '@Services/utils/copyData';
import { createFilterParams } from '@Services/utils/createFilterParams';
import { sortTranslatedObject } from '@Services/utils/translationUtils';
import { Crud } from '@/AdminService/Crud';
import { constructFormData } from '@Services/utils/constructFormData';

var controller = null;

const pageBlocksApi = {
    getPageBlocks: async (filters) => {
        try {
            let params = { 'filters[saveAsModel]': 1 };

            createFilterParams(filters, Crud?.pageBlocks?.list?.filtersData, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get('/page-blocks', {
                params: params,
                signal: controller.signal,
            });

            controller = null;

            const translatedList = sortTranslatedObject(result.data?.results);

            return { result: true, pageBlocks: translatedList, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, pageBlocks: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllPageBlocks: async () => {
        try {
            let params = { 'filters[page]': 0 };

            const result = await axios.get('/page-blocks', { params: params });

            return { result: true, pageBlocks: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOnePageBlock: async (id) => {
        try {
            const result = await axios.get(`/page-blocks/${id}`);

            return { result: true, pageBlock: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createPageBlock: async (values) => {
        try {
            const result = await axios.post('/page-blocks', constructFormData({ values, dataFields: Crud?.pageBlocks?.add?.api?.dataFields }));

            return { result: true, pageBlock: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editPageBlock: async (id, values) => {
        try {
            const result = await axios.post(`/page-blocks/${id}`, constructFormData({ values, dataFields: Crud?.pageBlocks?.edit?.api?.dataFields }));

            return { result: true, pageBlock: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deletePageBlock: async (id) => {
        try {
            await axios.delete(`/page-blocks/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    duplicatePageBlock: async (id) => {
        try {
            await axios.post(`/page-blocks/${id}/duplicate`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getTranslated: async (id, languageId) => {
        try {
            const result = await axios.get(`/page-blocks/${id}/translated/${languageId}`);
            const data = copyData(result?.data);

            return { result: true, pageBlock: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default pageBlocksApi;
