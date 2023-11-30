import moment from 'moment';

import { Constant } from '@/AdminService/Constant';

import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';
import { copyData } from '@Services/utils/copyData';
import { changeSlug } from '@Services/utils/changeSlug';
import { sortTranslatedObject } from '@Services/utils/translationUtils';
import { getSeoFormData } from '@Apps/SEO/services/api/seoApi';

const DEFAULT_PATH = '/products';

var controller = null;

const FILTERS_SORT_TAB = [
    {
        name: 'active',
        transformFilter: (params, sort) => {
            params['filters[active]'] = sort ? '1' : '0';
        },
    },
    { name: 'name', sortName: 'filters[name]' },
    {
        name: 'category',
        transformFilter: (params, values) => {
            values?.split(',').forEach((el, index) => {
                params[`filters[category][${index}]`] = el;
            });
        },
    },
    { name: 'lang', sortName: 'filters[lang]' },
    { name: 'page', sortName: 'filters[page]' },
    { name: 'limit', sortName: 'filters[limit]' },
    {
        name: 'sort',
        transformFilter: (params, sort) => {
            const splitSort = sort?.split(' ');

            params['filters[sortField]'] = splitSort[0];
            params['filters[sortOrder]'] = splitSort[1];
        },
    },
];

const getFormData = (data) => {
    let formData = new FormData();

    formData.append('active', data.active ? 1 : 0);
    formData.append('name', data.name);
    formData.append('slug', data.slug);
    formData.append('chapo', data.chapo);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('mainCategory', data.mainCategory);

    data?.productCategories?.forEach((category, index) => {
        formData.append(`productCategories[${index}]`, category);
    });

    data.productMedias?.forEach((productMedia, index) => {
        formData.append(`productMedias[${index}][media]`, productMedia.id);
        formData.append(`productMedias[${index}][mainImg]`, productMedia.mainImg ? 1 : 0);
        formData.append(`productMedias[${index}][position]`, productMedia.position || index + 1);
    });

    formData.append('lang', data.lang || '');
    formData.append('languageGroup', data.languageGroup || '');

    getSeoFormData(formData, data);

    return formData;
};

const productsApi = {
    getProducts: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, FILTERS_SORT_TAB, params);

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

    createProduct: async (data) => {
        try {
            const result = await axios.post('/products', getFormData(data));

            return { result: true, product: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editProduct: async (id, data) => {
        try {
            const result = await axios.post(`${DEFAULT_PATH}/${id}`, getFormData(data));

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
