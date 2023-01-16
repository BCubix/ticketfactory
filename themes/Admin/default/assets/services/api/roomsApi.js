import { Constant } from '@/AdminService/Constant';

import axios from '@Services/api/config';
import { changeSlug } from '@Services/utils/changeSlug';
import { copyData } from '@Services/utils/copyData';
import { createFilterParams } from '@Services/utils/createFilterParams';
import { sortTranslatedObject } from '@Services/utils/sortTranslatedObject';

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

const roomsApi = {
    getRooms: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get('/rooms', { params: params, signal: controller.signal });

            controller = null;

            const translatedList = sortTranslatedObject(result.data?.results);

            return { result: true, rooms: translatedList, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, rooms: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllRooms: async (filters) => {
        try {
            let params = { 'filters[page]': 0 };

            if (filters?.lang) {
                params['filters[lang]'] = filters?.lang;
            }

            const result = await axios.get('/rooms', { params: params });

            return { result: true, rooms: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneRoom: async (id) => {
        try {
            const result = await axios.get(`/rooms/${id}`);

            return { result: true, room: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createRoom: async (data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('name', data.name);
            formData.append('area', data.area);
            formData.append('seatsNb', data.seatsNb);
            formData.append('slug', changeSlug(data.slug));
            formData.append('lang', data.lang);
            formData.append('languageGroup', data.languageGroup);

            data.seatingPlans.forEach((plan, index) => {
                formData.append(`seatingPlans[${index}][name]`, plan.name);
            });

            const result = await axios.post('/rooms', formData);

            return { result: true, room: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editRoom: async (id, data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('name', data.name);
            formData.append('area', data.area);
            formData.append('seatsNb', data.seatsNb);
            formData.append('slug', changeSlug(data.slug));
            formData.append('lang', data.lang);
            formData.append('languageGroup', data.languageGroup);

            data.seatingPlans.forEach((plan, index) => {
                formData.append(`seatingPlans[${index}][name]`, plan.name);
            });

            const result = await axios.post(`/rooms/${id}`, formData);

            return { result: true, room: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteRoom: async (id) => {
        try {
            await axios.delete(`/rooms/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    duplicateRoom: async (id) => {
        try {
            await axios.post(`/rooms/${id}/duplicate`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getTranslated: async (id, languageId) => {
        try {
            const result = await axios.get(`/rooms/${id}/translated/${languageId}`);
            const data = copyData(result?.data);

            return { result: true, room: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default roomsApi;
