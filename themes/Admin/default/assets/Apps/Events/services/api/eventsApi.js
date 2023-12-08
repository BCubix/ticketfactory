import { Constant } from '@/AdminService/Constant';

import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';
import { copyData } from '@Services/utils/copyData';
import { sortTranslatedObject } from '@Services/utils/translationUtils';
import { constructFormData } from '@Services/utils/constructFormData';
import { Crud } from '@/AdminService/Crud';

const DEFAULT_PATH = '/events';

var controller = null;

const eventsApi = {
    getEvents: async (filters) => {
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

            const translatedList = sortTranslatedObject(result.data?.results);

            return { result: true, events: translatedList, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, events: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllEvents: async (filters) => {
        try {
            let params = { 'filters[page]': 0 };

            createFilterParams(filters, Crud?.events?.list?.filtersData, params);

            const result = await axios.get(DEFAULT_PATH, {
                params: params,
            });

            return { result: true, events: result.data?.results, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, events: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getOneEvent: async (id) => {
        try {
            const result = await axios.get(`${DEFAULT_PATH}/${id}`);
            const data = copyData(result?.data);

            return { result: true, event: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createEvent: async (values) => {
        try {
            const result = await axios.post(DEFAULT_PATH, constructFormData({ values, dataFields: Crud?.events?.add?.api?.dataFields }));

            return { result: true, event: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editEvent: async (id, values) => {
        try {
            const result = await axios.post(`${DEFAULT_PATH}/${id}`, constructFormData({ values, dataFields: Crud?.events?.edit?.api?.dataFields }));

            return { result: true, event: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteEvent: async (id) => {
        try {
            await axios.delete(`${DEFAULT_PATH}/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    duplicateEvent: async (id) => {
        try {
            await axios.post(`${DEFAULT_PATH}/${id}/duplicate`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getTranslated: async (id, languageId) => {
        try {
            const result = await axios.get(`${DEFAULT_PATH}/${id}/translated/${languageId}`);
            const data = copyData(result?.data);

            return { result: true, event: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default eventsApi;
