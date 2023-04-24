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

const infosApi = {
    getInfos: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get('/infos', { params: params, signal: controller.signal });

            controller = null;

            return { result: true, infos: result.data?.results, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, infos: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllInfos: async () => {
        try {
            let params = { 'filters[page]': 0 };

            const result = await axios.get('/infos', { params: params });

            return { result: true, infos: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneInfo: async (id) => {
        try {
            const result = await axios.get(`/infos/${id}`);

            return { result: true, info: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createInfo: async (data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('url', data.url);
            formData.append('beginDate', data.beginDate);
            formData.append('endDate', data.endDate);

            const result = await axios.post('/infos', formData);

            return { result: true, info: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editInfo: async (id, data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('url', data.url);
            formData.append('beginDate', data.beginDate);
            formData.append('endDate', data.endDate);

            const result = await axios.post(`/infos/${id}`, formData);

            return { result: true, info: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteInfo: async (id) => {
        try {
            await axios.delete(`/infos/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    duplicateInfo: async (id) => {
        try {
            await axios.post(`/infos/${id}/duplicate`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default infosApi;
