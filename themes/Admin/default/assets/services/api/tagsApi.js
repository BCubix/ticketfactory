import { Constant } from '@/AdminService/Constant';

import axios from '@Services/api/config';
import { changeSlug } from '@Services/utils/changeSlug';
import { copyData } from '@Services/utils/copyData';
import { createFilterParams } from '@Services/utils/createFilterParams';
import { sortTranslatedObject } from '@Services/utils/translationUtils';
import { getSeoFormData } from './seoApi';

var controller = null;

const FILTERS_SORT_TAB = [
    {
        name: 'active',
        transformFilter: (params, sort) => {
            params['filters[active]'] = sort ? '1' : '0';
        },
    },
    { name: 'name', sortName: 'filters[name]' },
    { name: 'page', sortName: 'filters[page]' },
    { name: 'lang', sortName: 'filters[lang]' },
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
    formData.append('description', data.description);
    formData.append('slug', changeSlug(data.slug));
    formData.append('lang', data.lang);
    formData.append('languageGroup', data.languageGroup);

    getSeoFormData(formData, data);

    return formData;
};

const tagsApi = {
    getTags: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get('/tags', { params: params, signal: controller.signal });

            controller = null;

            const translatedList = sortTranslatedObject(result.data?.results);

            return { result: true, tags: translatedList, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, tags: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllTags: async (filters) => {
        try {
            let params = { 'filters[page]': 0 };

            if (filters?.lang) {
                params['filters[lang]'] = filters?.lang;
            }

            const result = await axios.get('/tags', { params: params });

            return { result: true, tags: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneTag: async (id) => {
        try {
            const result = await axios.get(`/tags/${id}`);

            return { result: true, tag: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createTag: async (data) => {
        try {
            const result = await axios.post('/tags', getFormData(data));

            return { result: true, tag: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editTag: async (id, data) => {
        try {
            const result = await axios.post(`/tags/${id}`, getFormData(data));

            return { result: true, tag: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteTag: async (id) => {
        try {
            await axios.delete(`/tags/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getTranslated: async (id, languageId) => {
        try {
            const result = await axios.get(`/tags/${id}/translated/${languageId}`);
            let data = copyData(result?.data);

            return { result: true, tag: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default tagsApi;
