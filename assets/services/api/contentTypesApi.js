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
    { name: 'name', sortName: 'filters[name]' },
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

const serializeOptionsValidations = (element, name, formData) => {
    Object.entries(element).map(([key, value], index) => {
        if (null !== value && typeof value === 'object') {
            serializeOptionsValidations(value, `${name}[${key}][${index}]`, formData);
        } else {
            formData.append(`${name}[${index}][name]`, key);
            formData.append(`${name}[${index}][value]`, value);
        }
    });
};

const serializeData = (element, name, formData) => {
    Object.entries(element).map(([key, value]) => {
        if (null !== value && typeof value === 'object') {
            if (key === 'options' || key === 'validations') {
                serializeOptionsValidations(value, `${name}[${key}]`, formData);
            } else {
                serializeData(value, `${name}[${key}]`, formData);
            }
        } else if (null !== value && Array.isArray(value)) {
            value.forEach((el, index) => {
                serializeData(el, `${name}[${key}][${index}]`, formData);
            });
        } else {
            formData.append(`${name}[${key}]`, value);
        }
    });
};

const deserializeData = (data) => {
    const newData = data;

    newData?.fields?.forEach((field, fieldIndex) => {
        newData.fields[fieldIndex].options = field?.options?.reduce(
            (previousValue, currentValue) => ({
                ...previousValue,
                [currentValue.name]: currentValue.value,
            }),
            {}
        );

        newData.fields[fieldIndex].validations = field?.validations?.reduce(
            (previousValue, currentValue) => ({
                ...previousValue,
                [currentValue.name]: currentValue.value,
            }),
            {}
        );
    });

    return newData;
};

const contentTypesApi = {
    getContentTypes: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get('/content-types', {
                params: params,
                signal: controller.signal,
            });

            controller = null;

            return { result: true, contentTypes: result.data?.results, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, contentTypes: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllContentTypes: async () => {
        try {
            let params = { 'filters[page]': 0 };

            const result = await axios.get('/content-types', { params: params });

            return { result: true, contentTypes: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneContentType: async (id) => {
        try {
            const result = await axios.get(`content-types/${id}`);

            const data = deserializeData(result.data);
            return { result: true, contentType: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createContentType: async (data) => {
        try {
            const formData = new FormData();

            formData.append('active', data.active);
            formData.append('name', data.name);

            data.fields?.forEach((el, index) => {
                serializeData(el, `fields[${index}]`, formData);
            });

            const result = await axios.post(`/content-types`, formData);

            return { result: true, contentType: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editContentType: async (id, data) => {
        try {
            const formData = new FormData();

            formData.append('active', data.active);
            formData.append('name', data.name);

            data.fields?.forEach((el, index) => {
                serializeData(el, `fields[${index}]`, formData);
            });

            const result = await axios.post(`/content-types/${id}`, formData);

            return { result: true, contentType: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteContentType: async (id) => {
        try {
            await axios.delete(`/content-types/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default contentTypesApi;
