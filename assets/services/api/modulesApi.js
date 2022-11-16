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

const modulesApi = {
    getModules: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get('/modules', {
                params: params,
                signal: controller.signal,
            });

            controller = null;

            return { result: true, modules: result?.data?.results, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, modules: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getModulesActive: async () => {
        try {
            const result = await axios.get('/modules?filters[active]=1');

            return { result: true, modules: result?.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneModule: async (id) => {
        try {
            const result = await axios.get(`/modules/${id}`);

            return { result: true, module: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    uploadModule: async (data) => {
        try {
            let formData = new FormData();
            formData.append('active', data.active);
            formData.append('name', data.name);

            const result = await axios.post('/modules', formData);

            return { result: true, module: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    activeModule: async (id) => {
        try {
            const result = await axios.post(`/modules/${id}/active`);

            return { result: true, module: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    disableModule: async (id, uninstall, deleteFolder) => {
        try {
            const result = await axios.post(`/modules/${id}/active?filters[uninstall]=${uninstall ? 1 : 0}&filters[deleteFolder]=${deleteFolder ? 1 : 0}`);

            return { result: true, module: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default modulesApi;
