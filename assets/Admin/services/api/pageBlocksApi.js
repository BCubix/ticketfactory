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
            /*let params = {};

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get('/page-blocks', {
                params: params,
                signal: controller.signal,
            });

            controller = null;*/

            const results = [
                {
                    id: 1,
                    name: 'Bloc 1',
                    saveAsModel: true,
                    columns: [
                        {
                            content: '<p>Je suis un premier mini bloc !</p>',
                            xs: 12,
                            s: 12,
                            m: 12,
                            l: 12,
                            xl: 12,
                            position: 1,
                        },
                        {
                            content: '<p>Je suis un deuxième mini bloc !</p>',
                            xs: 12,
                            s: 12,
                            m: 12,
                            l: 12,
                            xl: 12,
                            position: 2,
                        },
                    ],
                },
            ];

            //return { result: true, pageBlocks: result.data?.results, total: result?.data?.total };
            return { result: true, pageBlocks: results, total: results.length };
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
