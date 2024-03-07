import axios from '@Services/api/config';
import { copyData } from '@Services/utils/copyData';
import { sortTranslatedCategory } from '@Services/utils/translationUtils';
import { constructFormData } from '@Services/utils/constructFormData';
import { Crud } from '@/AdminService/Crud';
import { createFilterParams } from '@Services/utils/createFilterParams';

const DEFAULT_PATH = '/product-categories';

const productCategoriesApi = {
    getProductCategories: async (filters) => {
        try {
            let params = {};

            if (filters?.lang) {
                params['filters[lang]'] = filters?.lang;
            }
            createFilterParams(filters, Crud?.categories?.list?.filtersData, params);

            const result = await axios.get(DEFAULT_PATH, { params: params });
            let data = sortTranslatedCategory(result.data);

            return { result: true, productCategories: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneProductCategory: async (id, filters) => {
        try {
            let params = {};

            if (filters?.lang) {
                params['filters[lang]'] = filters?.lang;
            }

            createFilterParams(filters, Crud?.productCategories?.list?.filtersData, params);

            const result = await axios.get(`${DEFAULT_PATH}/${id}`, { params: params });

            let data = sortTranslatedCategory(result.data);

            return { result: true, productCategory: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createProductCategory: async (values) => {
        try {
            const result = await axios.post(DEFAULT_PATH, constructFormData({ values, dataFields: Crud?.productCategories?.add?.api?.dataFields }));

            return { result: true, productCategory: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editProductCategory: async (id, values) => {
        try {
            const result = await axios.post(`${DEFAULT_PATH}/${id}`, constructFormData({ values, dataFields: Crud?.productCategories?.edit?.api?.dataFields }));

            return { result: true, productCategory: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteProductCategory: async (id, deleteProducts) => {
        try {
            await axios.delete(`${DEFAULT_PATH}/${id}?deleteProducts=${deleteProducts ? 1 : 0}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    duplicateProductCategory: async (id) => {
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

            return { result: true, productCategory: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    orderProductCategories: async (id, srcPosition, destPosition) => {
        try {
            await axios.post(`${DEFAULT_PATH}/${id}/order?src=${srcPosition}&dest=${destPosition}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default productCategoriesApi;
