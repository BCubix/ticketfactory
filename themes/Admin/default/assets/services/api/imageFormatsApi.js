import { Constant } from "@/AdminService/Constant";
import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';

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

const imageFormatsApi = {
    getImageFormats: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get('/image-formats', {
                params: params,
                signal: controller.signal,
            });

            controller = null;

            return { result: true, imageFormats: result.data?.results, total: result.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, imageFormats: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getOneImageFormat: async (id) => {
        try {
            const result = await axios.get(`/image-formats/${id}`);

            return { result: true, imageFormat: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createImageFormat: async (data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('name', data.name);
            formData.append('width', data.width);
            formData.append('height', data.height);
            formData.append('themeUse', data.themeUse ? 1 : 0);

            const result = await axios.post('/image-formats', formData);

            return { result: true, imageFormat: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editImageFormat: async (id, data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('name', data.name);
            formData.append('width', data.width);
            formData.append('height', data.height);
            formData.append('themeUse', data.themeUse ? 1 : 0);

            const result = await axios.post(`/image-formats/${id}`, formData);

            return { result: true, imageFormat: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteImageFormat: async (id) => {
        try {
            await axios.delete(`/image-formats/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    generateImageFormat: async (data, chunkMediaIndex) => {
        try {
            let url = '/image-formats/generate'
            if (data.formatId !== -1) {
                url += `/${data.formatId}`;
            }

            url += `?deleteOldThumbnails=${data.deleteOldThumbnails ? 1 : 0}`
            url += `&chunkMediaIndex=${chunkMediaIndex}`

            const result = await axios.post(url);

            return { result: true, imageFormat: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    }
};

export default imageFormatsApi;
