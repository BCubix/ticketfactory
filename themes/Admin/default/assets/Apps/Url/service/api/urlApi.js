import { Constant } from '@/AdminService/Constant';

import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';
import { constructFormData } from '@Services/utils/constructFormData';
import { Crud } from '@/AdminService/Crud';

const DEFAULT_PATH = '/url';

var controller = null;

const urlApi = {
    getUrl: async (filters) => {
        try {
            let params = { 'filters[page]': 0, 'filters[sortField]': 'position', 'filters[sortOrder]': 'ASC' };

            createFilterParams(filters, Crud?.url?.list?.filtersData, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get(DEFAULT_PATH, { params: params, signal: controller.signal });

            controller = null;

            return { result: true, url: result.data?.results, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, url: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllUrl: async (filters) => {
        try {
            let params = { 'filters[page]': 0, 'filters[sortField]': 'position', 'filters[sortOrder]': 'ASC' };

            const result = await axios.get(DEFAULT_PATH, { params: params });

            return { result: true, url: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneUrl: async (id) => {
        try {
            const result = await axios.get(`${DEFAULT_PATH}/${id}`);

            return { result: true, url: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editUrl: async (id, values) => {
        try {
            const result = await axios.post(`${DEFAULT_PATH}/${id}`, constructFormData({ values, dataFields: Crud?.url?.edit?.api?.dataFields }));

            return { result: true, url: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    orderUrl: async (id, srcPosition, destPosition) => {
        try {
            await axios.post(`${DEFAULT_PATH}/${id}/order?src=${srcPosition}&dest=${destPosition}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default urlApi;
