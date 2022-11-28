import { Constant } from "@/AdminService/Constant";
import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';

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
            formData.append(`${name}[${key}]`, value);
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

            return { result: true, contents: result.data?.results, total: result?.data?.total };
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

            return { result: true, content: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createContent: async (data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active);
            formData.append('title', data.title);

            Object.entries(data.fields)?.map(([key, value]) => {
                serializeData(value, `fields[${key}]`, formData);
            });

            const result = await axios.post(`/contents/${data.contentType}/create`, formData);

            return { result: true, content: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editContent: async (id, data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('title', data.title);

            Object.entries(data.fields)?.map(([key, value]) => {
                serializeData(value, `fields[${key}]`, formData);
            });

            const result = await axios.post(`/contents/${id}/edit`, formData);

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
};

export default contentsApi;
