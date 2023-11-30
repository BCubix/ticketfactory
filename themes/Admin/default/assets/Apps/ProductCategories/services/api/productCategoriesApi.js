import axios from '@Services/api/config';
import { changeSlug } from '@Services/utils/changeSlug';
import { copyData } from '@Services/utils/copyData';
import { sortTranslatedCategory } from '@Services/utils/translationUtils';
import { getSeoFormData } from '@Apps/SEO/services/api/seoApi';

const DEFAULT_PATH = '/product-categories';

const getFormData = (data) => {
    let formData = new FormData();

    formData.append('active', data.active ? 1 : 0);
    formData.append('name', data.name);
    formData.append('slug', changeSlug(data.slug));
    formData.append('keyword', changeSlug(data.keyword));
    formData.append('parent', data.parent);
    formData.append('lang', data.lang);
    formData.append('languageGroup', data.languageGroup);

    getSeoFormData(formData, data);

    return formData;
};

const productCategoriesApi = {
    getProductCategories: async (filters) => {
        try {
            let params = {};

            if (filters?.lang) {
                params['filters[lang]'] = filters?.lang;
            }

            const result = await axios.get(DEFAULT_PATH, { params: params });

            let data = sortTranslatedCategory(result.data);

            return { result: true, productCategories: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneProductCategory: async (id) => {
        try {
            const result = await axios.get(`${DEFAULT_PATH}/${id}`);

            let data = sortTranslatedCategory(result.data);

            return { result: true, productCategory: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createProductCategory: async (data) => {
        try {
            const result = await axios.post(DEFAULT_PATH, getFormData(data));

            return { result: true, productCategory: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editProductCategory: async (id, data) => {
        try {
            const result = await axios.post(`${DEFAULT_PATH}/${id}`, getFormData(data));

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
