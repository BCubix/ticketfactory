import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import axios from '@Services/api/config';
import { copyData } from '@Services/utils/copyData';
import { createFilterParams } from '@Services/utils/createFilterParams';
import { constructFormData } from '@Services/utils/constructFormData';

var controller = null;

const contentTypesApi = {
    getContentTypes: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, Crud?.contentTypes?.list?.filtersData, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get('/content-types', {
                params: params,
                signal: controller.signal,
            });

            controller = null;

            return { result: true, contentTypes: result.data?.results, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, contentTypes: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllContentTypes: async (filters = {}) => {
        try {
            let params = {};

            filters.page = 0;
            createFilterParams(filters, Crud?.contentTypes?.list?.filtersData, params);

            const result = await axios.get('/content-types', { params: params });

            return { result: true, contentTypes: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneContentType: async (id) => {
        try {
            const result = await axios.get(`content-types/${id}`);

            const data = copyData(result.data);

            return { result: true, contentType: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createContentType: async (values) => {
        try {
            const result = await axios.post(`/content-types`, constructFormData({ values, dataFields: Crud?.contentTypes?.add?.api?.dataFields }));

            return { result: true, contentType: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editContentType: async (id, values) => {
        try {
            const result = await axios.post(`/content-types/${id}`, constructFormData({ values, dataFields: Crud?.contentTypes?.edit?.api?.dataFields }));

            return { result: true, contentType: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteContentType: async (id) => {
        try {
            await axios.delete(`/content-types/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default contentTypesApi;
