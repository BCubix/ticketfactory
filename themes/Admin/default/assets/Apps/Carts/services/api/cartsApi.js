import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';

import { Constant } from '@/AdminService/Constant';

const DEFAULT_PATH = '/carts';

var controller = null;

const FILTERS_SORT_TAB = [
    {
        name: 'active',
        transformFilter: (params, sort) => {
            params['filters[active]'] = sort ? '1' : '0';
        },
    },
    { name: 'orderId', sortName: 'filters[orderId]' },
    { name: 'date', sortName: 'filters[date]' },
    { name: 'clientName', sortName: 'filters[clientName]' },
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

const cartsApi = {
    getCarts: async (filters) => {
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

            return { result: true, carts: result.data.results, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, carts: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllCarts: async (filters) => {
        try {
            let params = { 'filters[page]': 0 };

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            const result = await axios.get(DEFAULT_PATH, { params: params });

            return { result: true, carts: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneCart: async (id) => {
        try {
            const result = await axios.get(`${DEFAULT_PATH}/${id}`);

            return { result: true, cart: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default cartsApi;
