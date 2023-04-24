import { Constant } from "@/AdminService/Constant";
import axios from '@/services/api/config';
import { createFilterParams } from '@/services/utils/createFilterParams';

var controller = null;

const FILTERS_SORT_TAB = [
    {
        name: 'active',
        transformFilter: (params, sort) => {
            params['filters[active]'] = sort ? '1' : '0';
        },
    },
    {
        name: 'homeDisplayed',
        transformFilter: (params, sort) => {
            params['filters[homeDisplayed]'] = sort ? '1' : '0';
        },
    },
    { name: 'title', sortName: 'filters[title]' },
    { name: 'page',  sortName: 'filters[page]' },
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

const newsesApi = {
    getNewses: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get('/newses', { params: params, signal: controller.signal });

            controller = null;

            return { result: true, newses: result?.data?.results, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, newses: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllNewses: async () => {
        try {
            let params = { 'filters[page]': 0 };

            const result = await axios.get('/newses', { params: params });

            return { result: true, newses: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneNews: async (id) => {
        try {
            const result = await axios.get(`/newses/${id}`);

            return { result: true, news: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createNews: async (data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('homeDisplayed', data.homeDisplayed ? 1 : 0);
            formData.append('title', data.title);
            formData.append('subtitle', data.subtitle);
            formData.append('description', data.description);
            formData.append('mainMedia', data.mainMedia?.id);

            data.newsBlocks.forEach((block, index) => {
                formData.append(`newsBlocks[${index}][title]`, block.title);
                formData.append(`newsBlocks[${index}][content]`, block.content);
            });

            const result = await axios.post('/newses', formData);

            return { result: true, news: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editNews: async (id, data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('homeDisplayed', data.homeDisplayed ? 1 : 0);
            formData.append('title', data.title);
            formData.append('subtitle', data.subtitle);
            formData.append('description', data.description);
            formData.append('mainMedia', data.mainMedia?.id);

            data.newsBlocks.forEach((block, index) => {
                formData.append(`newsBlocks[${index}][title]`, block.title);
                formData.append(`newsBlocks[${index}][content]`, block.content);
            });

            const result = await axios.post(`/newses/${id}`, formData);

            return { result: true, news: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteNews: async (id) => {
        try {
            await axios.delete(`/newses/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    duplicateNews: async (id) => {
        try {
            await axios.post(`/newses/${id}/duplicate`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default newsesApi;
