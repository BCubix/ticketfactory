import { createFilterParams } from '../utils/createFilterParams';
import axios from './config';

var controller = null;

const FILTERS_SORT_TAB = [
    {
        name: 'active',
        transformFilter: (params, sort) => {
            params['filters[active]'] = sort ? '1' : '0';
        },
    },
    { name: 'title', sortName: 'filters[title]' },
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

const pagesApi = {
    getPages: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get('/pages', {
                params: params,
                signal: controller.signal,
            });

            controller = null;

            return { result: true, pages: result?.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOnePage: async (id) => {
        try {
            const result = await axios.get(`/pages/${id}`);

            return { result: true, page: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createPage: async (data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('title', data.title);

            data.pageBlocks.forEach((block, index) => {
                formData.append(`pageBlocks[${index}][content]`, block.content);
            });

            const result = await axios.post('/pages', formData);

            return { result: true, page: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editPage: async (id, data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('title', data.title);

            data.pageBlocks.forEach((block, index) => {
                formData.append(`pageBlocks[${index}][content]`, block.content);
            });

            const result = await axios.post(`/pages/${id}`, formData);

            return { result: true, page: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deletePage: async (id) => {
        try {
            await axios.delete(`/pages/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    duplicatePage: async (id) => {
        try {
            await axios.post(`/pages/${id}/duplicate`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default pagesApi;
