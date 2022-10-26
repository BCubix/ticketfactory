import { CANCELED_REQUEST_ERROR_CODE, MEDIA_FILE_PATH } from '../../Constant';
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
    { name: 'title', sortName: 'filters[title]' },
    { name: 'type', sortName: 'filters[type]' },
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

const mediasApi = {
    getMedias: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get('/medias', {
                params: params,
                signal: controller.signal,
            });

            controller = null;

            return { result: true, medias: result.data?.results, total: result?.data?.total };
        } catch (error) {
            if (error?.code === CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, medias: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllMedias: async () => {
        try {
            let params = { page: 1, limit: 10000 };

            const result = await axios.get('/medias', { params: params });

            return { result: true, medias: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneMedia: async (id) => {
        try {
            const result = await axios.get(`/medias/${id}`);

            return { result: true, media: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    updateImage: async (id, file, fileName) => {
        try {
            const byteString = window.atob(file.split(',')[1]);
            var mimeString = file.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            let ia = new Uint8Array(ab);

            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], {
                type: mimeString,
            });

            const mediaFile = new File([blob], `${fileName}.${mimeString.split('/')[1]}`);

            const formData = new FormData();

            formData.append('file', mediaFile);
            formData.append('type', mimeString);
            formData.append('filePath', MEDIA_FILE_PATH);
            formData.append('id', id);

            const result = await axios.post(`/_uploader/media/upload`, formData);

            return { result: true, media: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    // @Todo: create Media particular function
    createMedia: async (data) => {
        try {
            const result = await axios.post('/medias', formData);

            return { result: true, media: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editMedia: async (id, data) => {
        try {
            const formData = new FormData();

            formData.append('title', data?.title);
            formData.append('alt', data?.alt);
            formData.append('legend', data?.legend);
            formData.append('description', data?.description);
            formData.append('active', data.active ? 1 : 0);

            const result = await axios.post(`/medias/${id}`, formData);

            return { result: true, media: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteMedia: async (id) => {
        try {
            await axios.delete(`/medias/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default mediasApi;
