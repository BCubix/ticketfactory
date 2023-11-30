import { Constant } from '@/AdminService/Constant';

import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';
import { copyData } from '@Services/utils/copyData';
import { sortTranslatedObject } from '@Services/utils/translationUtils';
import { constructFormData } from '@Services/utils/constructFormData';
import { Crud } from '@/AdminService/Crud';

const DEFAULT_PATH = '/products';

var controller = null;

const productsApi = {
    getProducts: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, Crud.products?.list?.filtersData, params);

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

            return { result: true, products: translatedList, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, products: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getOneProduct: async (id) => {
        try {
            const result = await axios.get(`${DEFAULT_PATH}/${id}`);
            const data = copyData(result?.data);

            return { result: true, product: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createProduct: async (values) => {
        try {
            const result = await axios.post('/products', constructFormData({ values, dataFields: Crud?.products?.add?.api?.dataFields }));

            return { result: true, product: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editProduct: async (id, values) => {
        try {
            const result = await axios.post(`${DEFAULT_PATH}/${id}`, constructFormData({ values, dataFields: Crud?.products?.edit?.api?.dataFields }));

            return { result: true, product: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteProduct: async (id) => {
        try {
            await axios.delete(`${DEFAULT_PATH}/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    duplicateProduct: async (id) => {
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

            return { result: true, product: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default productsApi;
