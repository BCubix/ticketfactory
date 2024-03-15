import { Constant } from '@/AdminService/Constant';

import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';
import { sortTranslatedObject } from '@Services/utils/translationUtils';
import { constructFormData } from '@Services/utils/constructFormData';
import { Crud } from '@/AdminService/Crud';

var controller = null;

const ticketingApi = {
    getTicketing: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, Crud?.ticketing?.list?.filtersData, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get('/ticketing', { params: params, signal: controller.signal });

            controller = null;

            return { result: true, ticketing: result.data?.results, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, ticketing: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllTicketing: async (filters) => {
        try {
            let params = { 'filters[page]': 0 };

            const result = await axios.get('/ticketing', { params: params });

            return { result: true, ticketing: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneTicketing: async (id) => {
        try {
            const result = await axios.get(`/ticketing/${id}`);

            return { result: true, ticketing: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createTicketing: async (values, apiSchema) => {
        try {
            const result = await axios.post('/ticketing', constructFormData({ values, dataFields: apiSchema || Crud?.ticketing?.add?.api?.dataFields }));

            return { result: true, ticketing: result.data };
        } catch (error) {
            console.error(error);
            return { result: false, error: error?.response?.data };
        }
    },

    editTicketing: async (id, values, apiSchema) => {
        try {
            const result = await axios.post(`/ticketing/${id}`, constructFormData({ values, dataFields: apiSchema || Crud?.ticketing?.edit?.api?.dataFields }));

            return { result: true, ticketing: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteTicketing: async (id) => {
        try {
            await axios.delete(`/ticketing/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    setDefaultTicketing: async (id) => {
        try {
            await axios.post(`/ticketing/${id}/set-default-ticketing`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getEventLength: async (id) => {
        try {
            const result = await axios.post(`/ticketing/${id}/get-event-length`);

            return { result: true, length: result?.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default ticketingApi;
