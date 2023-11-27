import { Constant } from '@/AdminService/Constant';
import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';
import { constructFormData } from '@Services/utils/constructFormData';
import { Crud } from '@/AdminService/Crud';

var controller = null;

const imageFormatsApi = {
    getImageFormats: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, Crud?.imageFormats?.list?.filtersData, params);

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

    getAllImageFormat: async (filters) => {
        try {
            let params = { 'filters[page]': 0 };

            createFilterParams(filters, Crud?.imageFormats?.list?.filtersData, params);

            params['filters[page]'] = 0;

            if (filters?.lang) {
                params['filters[lang]'] = filters?.lang;
            }

            const result = await axios.get('/image-formats', { params: params });

            return { result: true, imageFormats: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createImageFormat: async (values) => {
        try {
            const result = await axios.post('/image-formats', constructFormData({ values, dataFields: Crud?.imageFormats?.add?.api?.dataFields }));

            return { result: true, imageFormat: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editImageFormat: async (id, values) => {
        try {
            const result = await axios.post(`/image-formats/${id}`, constructFormData({ values, dataFields: Crud?.imageFormats?.edit?.api?.dataFields }));

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
            let url = '/image-formats/generate';
            if (data.formatId !== -1) {
                url += `/${data.formatId}`;
            }

            url += `?deleteOldThumbnails=${data.deleteOldThumbnails ? 1 : 0}`;
            url += `&chunkMediaIndex=${chunkMediaIndex}`;

            const result = await axios.post(url);

            return { result: true, imageFormat: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default imageFormatsApi;
