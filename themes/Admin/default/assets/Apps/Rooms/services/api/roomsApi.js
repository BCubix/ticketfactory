import { Constant } from '@/AdminService/Constant';

import axios from '@Services/api/config';
import { copyData } from '@Services/utils/copyData';
import { createFilterParams } from '@Services/utils/createFilterParams';
import { sortTranslatedObject } from '@Services/utils/translationUtils';
import { constructFormData } from '@Services/utils/constructFormData';
import { Crud } from '@/AdminService/Crud';

const DEFAULT_PATH = '/rooms';

var controller = null;

const roomsApi = {
    getRooms: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, Crud?.rooms?.list?.filtersData, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get(DEFAULT_PATH, { params: params, signal: controller.signal });

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

            const result = await axios.get(DEFAULT_PATH, { params: params });

            return { result: true, rooms: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneRoom: async (id) => {
        try {
            const result = await axios.get(`${DEFAULT_PATH}/${id}`);

            return { result: true, room: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createRoom: async (values) => {
        try {
            const result = await axios.post(DEFAULT_PATH, constructFormData({ values, dataFields: Crud?.rooms?.add?.api?.dataFields }));

            return { result: true, room: result.data };
        } catch (error) {
            console.error(error);
            return { result: false, error: error?.response?.data };
        }
    },

    editRoom: async (id, values) => {
        try {
            const result = await axios.post(`${DEFAULT_PATH}/${id}`, constructFormData({ values, dataFields: Crud?.rooms?.edit?.api?.dataFields }));

            return { result: true, room: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteRoom: async (id) => {
        try {
            await axios.delete(`${DEFAULT_PATH}/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    duplicateRoom: async (id) => {
        try {
            await axios.post(`${DEFAULT_PATH}/${id}/duplicate`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getTranslated: async (id, languageId) => {
        try {
            const result = await axios.get(`${DEFAULT_PATH}/${id}/translated/${languageId}`);
            const data = copyData(result?.data);

            return { result: true, room: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default roomsApi;
