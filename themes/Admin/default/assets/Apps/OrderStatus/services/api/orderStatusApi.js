import { Constant } from '@/AdminService/Constant';

import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';
import { constructFormData } from '@Services/utils/constructFormData';
import { Crud } from '@/AdminService/Crud';

const DEFAULT_PATH = '/order-status';

var controller = null;

const orderStatusApi = {
    getOrderStatus: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, Crud?.orderStatus?.list?.filtersData, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get(DEFAULT_PATH, { params: params, signal: controller.signal });

            controller = null;

            return { result: true, orderStatus: result.data?.results, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, orderStatus: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllOrderStatus: async (filters) => {
        try {
            let params = { 'filters[page]': 0 };

            if (filters?.lang) {
                params['filters[lang]'] = filters?.lang;
            }

            const result = await axios.get(DEFAULT_PATH, { params: params });

            return { result: true, orderStatus: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneOrderStatus: async (id) => {
        try {
            const result = await axios.get(`${DEFAULT_PATH}/${id}`);

            return { result: true, orderStatus: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editOrderStatus: async (id, values) => {
        try {
            const result = await axios.post(`${DEFAULT_PATH}/${id}`, constructFormData({ values, dataFields: Crud?.orderStatus?.edit?.api?.dataFields }));

            return { result: true, orderStatus: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default orderStatusApi;
