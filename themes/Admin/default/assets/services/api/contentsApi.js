import { Constant } from '@/AdminService/Constant';

import axios from '@Services/api/config';
import { changeSlug } from '@Services/utils/changeSlug';
import { createFilterParams } from '@Services/utils/createFilterParams';
import { copyData } from '@Services/utils/copyData';
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
    { name: 'title', sortName: 'filters[title]' },
    {
        name: 'contentType',
        transformFilter: (params, values) => {
            values?.split(',').forEach((el, index) => {
                params[`filters[contentType][${index}]`] = el;
            });
        },
    },
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
    formData.append('title', data.title);
    formData.append('slug', changeSlug(data.slug));
    formData.append('page', data.page || '');
    formData.append('lang', data.lang);
    formData.append('languageGroup', data.languageGroup);

    if (data.page) {
        formData.append('page', data.page);
    }

    Object.entries(data.fields)?.map(([key, value]) => {
        serializeData(value, `fields[${key}]`, formData);
    });

    getSeoFormData(formData, data);

    return formData;
};

const serializeData = (element, name, formData) => {
    if (null !== element && typeof element !== 'object') {
        formData.append(name, element);

        return;
    }

    Object.entries(element).map(([key, value]) => {
        if (null !== value && typeof value === 'object') {
            serializeData(value, `${name}[${key}]`, formData);
        } else if (null !== value && Array.isArray(value)) {
            value.forEach((el, index) => {
                serializeData(el, `${name}[${key}][${index}]`, formData);
            });
        } else {
            formData.append(`${name}[${key}]`, value !== null ? value : '');
        }
    });
};

const contentsApi = {
    getContents: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get('/contents', {
                params: params,
                signal: controller.signal,
            });

            controller = null;

            const translatedList = sortTranslatedObject(result.data?.results);

            return { result: true, contents: translatedList, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, contents: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getOneContent: async (id) => {
        try {
            const result = await axios.get(`/contents/${id}`);
            const data = copyData(result?.data);

            return { result: true, content: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createContent: async (data) => {
        try {
            const result = await axios.post(`/contents/${data.contentType}/create`, getFormData(data));

            return { result: true, content: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editContent: async (id, data) => {
        try {
            const result = await axios.post(`/contents/${id}/edit`, getFormData(data));

            return { result: true, content: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteContent: async (id) => {
        try {
            await axios.delete(`/contents/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    duplicateContent: async (id) => {
        try {
            await axios.post(`/contents/${id}/duplicate`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getTranslated: async (id, languageId) => {
        try {
            const result = await axios.get(`/contents/${id}/translated/${languageId}`);
            const data = copyData(result?.data);

            return { result: true, content: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getAvailable: async (id) => {
        try {
            const result = await axios.get(`/contents/${id}/availableContent`);

            return { result: true, number: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getContentByPageId: async (id) => {
        try {
            const result = await axios.get(`/contents/${id}/page`);

            return { result: true, content: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default contentsApi;
