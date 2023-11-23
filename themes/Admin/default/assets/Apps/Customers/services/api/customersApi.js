import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';

import { Constant } from '@/AdminService/Constant';

const DEFAULT_PATH = '/customers';

var controller = null;

const FILTERS_SORT_TAB = [
    {
        name: 'active',
        transformFilter: (params, sort) => {
            params['filters[active]'] = sort ? '1' : '0';
        },
    },
    { name: 'email', sortName: 'filters[email]' },
    { name: 'firstName', sortName: 'filters[firstName]' },
    { name: 'lastName', sortName: 'filters[lastName]' },
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

    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('civility', data.civility);
    formData.append('active', data.active ? 1 : 0);

    if (data.plainPassword && data.confirmPassword) {
        formData.append('plainPassword', data.plainPassword);
    }

    return formData;
};

const customersApi = {
    getCustomers: async (filters) => {
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

    createCustomer: async (data) => {
        try {
            const result = await axios.post(DEFAULT_PATH, getFormData(data));

            return { result: true, customer: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editCustomer: async (id, data) => {
        try {
            const result = await axios.post(`${DEFAULT_PATH}/${id}`, getFormData(data));

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
