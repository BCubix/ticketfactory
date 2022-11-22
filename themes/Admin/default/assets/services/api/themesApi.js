import { Constant } from '@/AdminService/Constant';
import axios from '@Services/api/config';
import { createFilterParams } from "@Services/utils/createFilterParams";

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

const themesApi = {
    getThemes: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get('/themes', {
                params: params,
                signal: controller.signal,
            });

            controller = null;

            return { result: true, themes: result?.data?.results, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, themes: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getThemesActive: async () => {
        try {
            const result = await axios.get('/themes?filters[active]=1');

            return { result: true, themes: result?.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneTheme: async (id) => {
        try {
            const result = await axios.get(`/themes/${id}`);

            return { result: true, theme: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    uploadTheme: async (data) => {
        try {
            let formData = new FormData();
            formData.append('active', data.active);
            formData.append('name', data.name);

            const result = await axios.post('/themes', formData);

            return { result: true, theme: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    activeTheme: async (id) => {
        try {
            const result = await axios.post(`/themes/${id}/active`);

            return { result: true, theme: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    disableTheme: async (id, action) => {
        try {
            const result = await axios.post(`/themes/${id}/active?action=${action}`);

            return { result: true, theme: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default themesApi;
