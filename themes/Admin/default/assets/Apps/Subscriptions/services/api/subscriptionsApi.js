import { Constant } from '@/AdminService/Constant';
import axios from '@Services/api/config';
import { copyData } from '@Services/utils/copyData';
import { createFilterParams } from '@Services/utils/createFilterParams';
import { sortTranslatedObject } from '@Services/utils/translationUtils';
import { constructFormData } from '@Services/utils/constructFormData';
import { Crud } from '@/AdminService/Crud';

const DEFAULT_PATH = '/subscriptions';

var controller = null;

const subscriptionsApi = {
    getSubscriptions: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, Crud?.subscriptions?.list?.filtersData, params);

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

            return { result: true, subscriptions: translatedList, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, subscriptions: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllSubscriptions: async (filters) => {
        try {
            let params = { 'filters[page]': 0 };

            if (filters?.lang) {
                params['filters[lang]'] = filters?.lang;
            }

            const result = await axios.get(DEFAULT_PATH, { params: params });

            return { result: true, subscriptions: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneSubscription: async (id) => {
        try {
            const result = await axios.get(`${DEFAULT_PATH}/${id}`);

            return { result: true, subscription: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createSubscription: async (values) => {
        try {
            const result = await axios.post(DEFAULT_PATH, constructFormData({ values, dataFields: Crud?.subscriptions?.add?.api?.dataFields }));

            return { result: true, subscription: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editSubscription: async (id, values) => {
        try {
            const result = await axios.post(`${DEFAULT_PATH}/${id}`, constructFormData({ values, dataFields: Crud?.subscriptions?.edit?.api?.dataFields }));

            return { result: true, subscription: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteSubscription: async (id) => {
        try {
            await axios.delete(`${DEFAULT_PATH}/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    duplicateSubscription: async (id) => {
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

            return { result: true, subscription: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default subscriptionsApi;
