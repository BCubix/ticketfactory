import { Constant } from '@/AdminService/Constant';
import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';

var controller = null;

const FILTERS_SORT_TAB = [
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

const pageBlocksApi = {
    getPageBlocks: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get('/page-blocks', {
                params: params,
                signal: controller.signal,
            });

            controller = null;

            return { result: true, pageBlocks: result.data?.results, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, pageBlocks: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllPageBlocks: async () => {
        try {
            let params = { 'filters[page]': 0 };

            const result = await axios.get('/page-blocks', { params: params });

            return { result: true, pageBlocks: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOnePageBlock: async (id) => {
        try {
            const result = await axios.get(`/page-blocks/${id}`);

            return { result: true, pageBlock: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createPageBlock: async (data) => {
        try {
            const formData = new FormData();

            formData.append('name', data?.name);
            formData.append('saveAsModel', 1);

            data.columns.forEach((column, index) => {
                formData.append(`columns[${index}][content]`, column.content);
                formData.append(`columns[${index}][xs]`, column.xs);
                formData.append(`columns[${index}][s]`, column.s);
                formData.append(`columns[${index}][m]`, column.m);
                formData.append(`columns[${index}][l]`, column.l);
                formData.append(`columns[${index}][xl]`, column.xl);
            });

            const result = await axios.post('/page-blocks', formData);

            return { result: true, pageBlock: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editPageBlock: async (id, data) => {
        try {
            const formData = new FormData();

            formData.append('name', data?.name);
            formData.append('saveAsModel', 1);

            data.columns.forEach((column, index) => {
                formData.append(`columns[${index}][content]`, column.content);
                formData.append(`columns[${index}][xs]`, column.xs);
                formData.append(`columns[${index}][s]`, column.s);
                formData.append(`columns[${index}][m]`, column.m);
                formData.append(`columns[${index}][l]`, column.l);
                formData.append(`columns[${index}][xl]`, column.xl);
            });

            const result = await axios.post(`/page-blocks/${id}`, formData);

            return { result: true, pageBlock: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deletePageBlock: async (id) => {
        try {
            await axios.delete(`/page-blocks/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default pageBlocksApi;
