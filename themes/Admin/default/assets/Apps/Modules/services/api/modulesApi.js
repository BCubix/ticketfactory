import { Constant } from '@/AdminService/Constant';
import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';

var controller = null;

const FILTERS_SORT_TAB = [
    {
        key: 'active',
        transformFilter: (params, sort) => {
            params['filters[active]'] = sort ? '1' : '0';
        },
    },
    { key: 'name', sortName: 'filters[name]' },
    { key: 'page', sortName: 'filters[page]' },
    { key: 'limit', sortName: 'filters[limit]' },
    {
        key: 'sort',
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

    getAllModules: async (filters) => {
        try {
            let params = { 'filters[page]': 0 };

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            const result = await axios.get('/modules', {
                params: params,
            });

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
            formData.append('active', data.active ? 1 : 0);
            formData.append('name', data.name);

            const result = await axios.post('/modules', formData);

            return { result: true, module: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    activeModule: async (name) => {
        try {
            const result = await axios.post(`/modules/${name}/active`);

            return { result: true, module: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    disableModule: async (name, action) => {
        try {
            const result = await axios.post(`/modules/${name}/active?action=${action}`);

            return { result: true, module: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getModuleImage: async (id) => {
        try {
            const result = await axios.get(`/modules/moduleImage/${id}`, { responseType: 'arraybuffer' });

            if (!result.data) {
                return { result: true, image: '' };
            }

            const base64Image = btoa(
                new Uint8Array(result.data).reduce((data, byte) => data + String.fromCharCode(byte)),
                ''
            );
            const formattedBase64 = base64Image.replace(/(.{64})/g, '$1\n');
            const imageDataUrl = `data:${result.headers['content-type']};base64,${formattedBase64}`;

            return { result: true, image: imageDataUrl };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default modulesApi;
