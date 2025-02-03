import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import axios from '@Services/api/config';
import { copyData } from '@Services/utils/copyData';
import { createFilterParams } from '@Services/utils/createFilterParams';
import { constructFormData } from '@Services/utils/constructFormData';

const DEFAULT_PATH = '/page-block-types';

var controller = null;

const pageBlockTypesApi = {
    getPageBlockTypes: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, Crud?.pageBlockTypes?.list?.filtersData, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get(`${DEFAULT_PATH}`, {
                params: params,
                signal: controller.signal,
            });

            controller = null;

            return { result: true, pageBlockTypes: result.data?.results, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, pageBlockTypes: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllPageBlockTypes: async (filters = {}) => {
        try {
            let params = {};

            filters.page = 0;
            createFilterParams(filters, Crud?.pageBlockTypes?.list?.filtersData, params);

            const result = await axios.get(`${DEFAULT_PATH}`, { params: params });

            return { result: true, pageBlockTypes: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOnePageBlockType: async (id) => {
        try {
            const result = await axios.get(`${DEFAULT_PATH}/${id}`);

            const data = copyData(result.data);

            return { result: true, pageBlockType: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createPageBlockType: async (values) => {
        try {
            const result = await axios.post(`${DEFAULT_PATH}`, constructFormData({ values, dataFields: Crud?.pageBlockTypes?.add?.api?.dataFields }));

            return { result: true, pageBlockType: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editPageBlockType: async (id, values) => {
        try {
            const result = await axios.post(`${DEFAULT_PATH}/${id}`, constructFormData({ values, dataFields: Crud?.pageBlockTypes?.edit?.api?.dataFields }));

            return { result: true, pageBlockType: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deletePageBlockType: async (id) => {
        try {
            await axios.delete(`${DEFAULT_PATH}/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default pageBlockTypesApi;
