import { Constant } from '@/AdminService/Constant';
import axios from '@Services/api/config';
import { changeSlug } from '@Services/utils/changeSlug';
import { copyData } from '@Services/utils/copyData';
import { createFilterParams } from '@Services/utils/createFilterParams';
import { sortTranslatedObject } from '@Services/utils/translationUtils';
import { getSeoFormData } from './seoApi';

var controller = null;

const FILTERS_SORT_TAB = [
    {
        name: 'active',
        transformFilter: (params, sort) => {
            params['filters[active]'] = sort ? '1' : '0';
        },
    },
    { name: 'beginYear', sortName: 'filters[beginYear]' },
    { name: 'name', sortName: 'filters[name]' },
    { name: 'page', sortName: 'filters[page]' },
    { name: 'lang', sortName: 'filters[lang]' },
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

const getFormData = (data) => {
    let formData = new FormData();

    formData.append('active', data.active ? 1 : 0);
    formData.append('name', data.name);
    formData.append('beginYear', data.beginYear);
    formData.append('slug', changeSlug(data.slug));
    formData.append('lang', data.lang);
    formData.append('languageGroup', data.languageGroup);

    getSeoFormData(formData, data);

    return formData;
};

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

            const translatedList = sortTranslatedObject(result.data?.results);

            return { result: true, seasons: translatedList, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, seasons: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllSeasons: async (filters) => {
        try {
            let params = { 'filters[page]': 0 };

            if (filters?.lang) {
                params['filters[lang]'] = filters?.lang;
            }

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
            const result = await axios.post('/seasons', getFormData(data));

            return { result: true, season: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editSeason: async (id, data) => {
        try {
            const result = await axios.post(`/seasons/${id}`, getFormData(data));

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

    getTranslated: async (id, languageId) => {
        try {
            const result = await axios.get(`/seasons/${id}/translated/${languageId}`);
            const data = copyData(result?.data);

            return { result: true, season: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default seasonsApi;
