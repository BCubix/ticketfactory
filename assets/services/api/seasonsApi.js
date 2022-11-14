import { CANCELED_REQUEST_ERROR_CODE } from '../../Constant';
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

const seasonsApi = {
    getSeasons: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get('/seasons', {
                params: params,
                signal: controller.signal,
            });

            controller = null;

            return { result: true, seasons: result.data?.results, total: result?.data?.total };
        } catch (error) {
            if (error?.code === CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, seasons: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllSeasons: async () => {
        try {
            let params = { 'filters[page]': 0 };

            const result = await axios.get('/seasons', { params: params });

            return { result: true, seasons: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneSeason: async (id) => {
        try {
            const result = await axios.get(`/seasons/${id}`);

            return { result: true, season: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createSeason: async (data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('name', data.name);
            formData.append('beginYear', data.beginYear);

            const result = await axios.post('/seasons', formData);

            return { result: true, season: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editSeason: async (id, data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('name', data.name);
            formData.append('beginYear', data.beginYear);

            const result = await axios.post(`/seasons/${id}`, formData);

            return { result: true, season: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteSeason: async (id) => {
        try {
            await axios.delete(`/seasons/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    duplicateSeason: async (id) => {
        try {
            await axios.post(`/seasons/${id}/duplicate`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default seasonsApi;
