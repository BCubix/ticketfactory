import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';

import { Constant } from '@/AdminService/Constant';

const DEFAULT_PATH = '/vouchers';

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

    formData.append('name', data.name);
    formData.append('code', data.code);
    formData.append('discount', data.discount);
    formData.append('unit', data.unit);
    formData.append('beginDate', data.beginDate);
    formData.append('endDate', data.endDate);
    formData.append('active', data.active ? 1 : 0);

    return formData;
};

const vouchersApi = {
    getVouchers: async (filters) => {
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

            return { result: true, vouchers: result.data.results, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, vouchers: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllVouchers: async (filters) => {
        try {
            let params = { 'filters[page]': 0 };

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            const result = await axios.get(DEFAULT_PATH, { params: params });

            return { result: true, vouchers: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneVoucher: async (id) => {
        try {
            const result = await axios.get(`${DEFAULT_PATH}/${id}`);

            return { result: true, voucher: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createVoucher: async (data) => {
        try {
            const result = await axios.post(DEFAULT_PATH, getFormData(data));

            return { result: true, voucher: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editVoucher: async (id, data) => {
        try {
            const result = await axios.post(`${DEFAULT_PATH}/${id}`, getFormData(data));

            return { result: true, voucher: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteVoucher: async (id) => {
        try {
            await axios.delete(`${DEFAULT_PATH}/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default vouchersApi;
