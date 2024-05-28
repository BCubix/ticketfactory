import { Constant } from '@/AdminService/Constant';

import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';
import { sortTranslatedObject } from '@Services/utils/translationUtils';
import { constructFormData } from '@Services/utils/constructFormData';
import { Crud } from '@/AdminService/Crud';

const DEFAULT_PATH = '/event-types';

var controller = null;

const eventTypesApi = {
    getEventTypes: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, Crud?.eventTypes?.list?.filtersData, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get(DEFAULT_PATH, { params: params, signal: controller.signal });

            controller = null;

            const translatedList = sortTranslatedObject(result.data?.results);

            return { result: true, eventTypes: translatedList, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, eventTypes: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllEventTypes: async (filters) => {
        try {
            let params = { 'filters[page]': 0 };

            if (filters?.lang) {
                params['filters[lang]'] = filters?.lang;
            }

            const result = await axios.get(DEFAULT_PATH, { params: params });

            return { result: true, eventTypes: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneEventType: async (id) => {
        try {
            const result = await axios.get(`${DEFAULT_PATH}/${id}`);

            return { result: true, eventType: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editEventType: async (id, values) => {
        try {
            const result = await axios.post(`${DEFAULT_PATH}/${id}`, constructFormData({ values, dataFields: Crud?.eventTypes?.edit?.api?.dataFields }));

            return { result: true, eventType: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default eventTypesApi;
