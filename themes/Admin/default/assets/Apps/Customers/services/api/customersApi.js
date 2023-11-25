import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';

import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import { constructFormData } from '@Services/utils/constructFormData';

const DEFAULT_PATH = '/customers';

var controller = null;

const customersApi = {
    getCustomers: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, Crud?.events?.list?.filtersData, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get(DEFAULT_PATH, {
                params: params,
                signal: controller.signal,
            });

            controller = null;

            return { result: true, customers: result.data.results, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, customers: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllCustomers: async (filters) => {
        try {
            let params = { 'filters[page]': 0 };

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            const result = await axios.get(DEFAULT_PATH, { params: params });

            return { result: true, customers: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneCustomer: async (id) => {
        try {
            const result = await axios.get(`${DEFAULT_PATH}/${id}`);

            return { result: true, customer: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createCustomer: async (values) => {
        try {
            const result = await axios.post(DEFAULT_PATH, constructFormData({ values, dataFields: Crud?.customers?.add?.api?.dataFields }));

            return { result: true, customer: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editCustomer: async (id, values) => {
        try {
            const result = await axios.post(`${DEFAULT_PATH}/${id}`, constructFormData({ values, dataFields: Crud?.customers?.edit?.api?.dataFields }));

            return { result: true, customer: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteCustomer: async (id) => {
        try {
            await axios.delete(`${DEFAULT_PATH}/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default customersApi;
