import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';

import { Constant } from '@/AdminService/Constant';

const DEFAULT_PATH = '/discounts';

var controller = null;

const FILTERS_SORT_TAB = [
    {
        name: 'active',
        transformFilter: (params, sort) => {
            params['filters[active]'] = sort ? '1' : '0';
        },
    },
    { name: 'limit', sortName: 'filters[limit]' },
    {
        name: 'sort',
        transformFilter: (params, sort) => {
            const splitSort = sort?.split(' ');

            params['filters[sortField]'] = splitSort[0];
            params['filters[sortOrder]'] = splitSort[1];
        },
    },
];

const getFormData = (data) => {
    let formData = new FormData();

    formData.append('code', data.code);
    formData.append('discount', data.discount);
    formData.append('unit', data.unit);
    formData.append('active', data.active ? 1 : 0);

    return formData;
};

const discountsApi = {
    getDiscounts: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get(DEFAULT_PATH, {
                params: params,
                signal: controller.signal,
            });

            controller = null;

            return { result: true, discounts: result.data.results, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, discounts: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllDiscounts: async (filters) => {
        try {
            let params = { 'filters[page]': 0 };

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            const result = await axios.get(DEFAULT_PATH, { params: params });

            return { result: true, discounts: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneDiscount: async (id) => {
        try {
            const result = await axios.get(`${DEFAULT_PATH}/${id}`);

            return { result: true, discount: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createDiscount: async (data) => {
        try {
            const result = await axios.post(DEFAULT_PATH, getFormData(data));

            return { result: true, discount: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editDiscount: async (id, data) => {
        try {
            const result = await axios.post(`${DEFAULT_PATH}/${id}`, getFormData(data));

            return { result: true, discount: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteDiscount: async (id) => {
        try {
            await axios.delete(`${DEFAULT_PATH}/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default discountsApi;
