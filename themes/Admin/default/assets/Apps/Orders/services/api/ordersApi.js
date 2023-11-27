import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';

import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';

const DEFAULT_PATH = '/orders';

var controller = null;

const ordersApi = {
    getOrders: async (filters) => {
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

            return { result: true, orders: result.data.results, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, orders: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllOrders: async (filters) => {
        try {
            let params = { 'filters[page]': 0 };

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            const result = await axios.get(DEFAULT_PATH, { params: params });

            return { result: true, orders: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneOrder: async (id) => {
        try {
            const result = await axios.get(`${DEFAULT_PATH}/${id}`);

            return { result: true, order: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default ordersApi;
