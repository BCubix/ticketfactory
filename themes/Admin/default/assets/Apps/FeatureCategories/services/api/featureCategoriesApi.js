import { Constant } from '@/AdminService/Constant';

import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';
import { copyData } from '@Services/utils/copyData';
import { sortTranslatedObject } from '@Services/utils/translationUtils';
import { constructFormData } from '@Services/utils/constructFormData';
import { Crud } from '@/AdminService/Crud';

const DEFAULT_PATH = '/features-categories';

var controller = null;

const featureCategoriesApi = {
    getFeatureCategories: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, Crud.featureCategories?.list?.filtersData, params);

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

            return { result: true, featureCategories: translatedList, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, featureCategories: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllFeatureCategories: async (filters) => {
        try {
            let params = { 'filters[page]': 0 };

            if (filters?.lang) {
                params['filters[lang]'] = filters?.lang;
            }

            const result = await axios.get(DEFAULT_PATH, { params: params });

            return { result: true, featureCategories: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneFeatureCategory: async (id) => {
        try {
            const result = await axios.get(`${DEFAULT_PATH}/${id}`);
            const data = copyData(result?.data);

            return { result: true, featureCategory: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createFeatureCategory: async (values) => {
        try {
            const result = await axios.post(DEFAULT_PATH, constructFormData({ values, dataFields: Crud?.featureCategories?.add?.api?.dataFields }));

            return { result: true, featureCategory: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editFeatureCategory: async (id, values) => {
        try {
            const result = await axios.post(`${DEFAULT_PATH}/${id}`, constructFormData({ values, dataFields: Crud?.featureCategories?.edit?.api?.dataFields }));

            return { result: true, featureCategory: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteFeatureCategory: async (id) => {
        try {
            await axios.delete(`${DEFAULT_PATH}/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    duplicateFeatureCategory: async (id) => {
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

            return { result: true, featureCategory: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default featureCategoriesApi;
