import { Constant } from '@/AdminService/Constant';
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
    {
        name: 'iframe',
        transformFilter: (params, sort) => {
            params['filters[iframe]'] = sort ? '1' : '0';
        },
    },
    { name: 'title', sortName: 'filters[title]' },
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
    {
        name: 'category',
        transformFilter: (params, values) => {
            values?.split(',').forEach((el, index) => {
                params[`filters[category][${index}]`] = el;
            });
        },
    },
    {
        name: 'type',
        transformFilter: (params, sort) => {
            if (typeof sort === 'string') {
                sort = sort.split(',');
            }

            sort?.forEach((el, index) => {
                params[`filters[type][${index}]`] = el;
            });
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
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, medias: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getMediasList: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            const result = await axios.get('/medias', {
                params: params,
            });

            return { result: true, medias: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getAllMedias: async () => {
        try {
            let params = { 'filters[page]': 0 };

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
            formData.append('filePath', Constant.MEDIA_FILE_PATH);
            formData.append('id', id);

            const result = await axios.post(`/_uploader/media/upload`, formData);

            return { result: true, media: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createIframeMedia: async (data) => {
        try {
            const formData = new FormData();

            formData.append('title', data?.title);
            formData.append('subtitle', data?.subtitle);
            formData.append('alt', data?.alt);
            formData.append('legend', data?.legend);
            formData.append('description', data?.description);
            formData.append('active', data.active ? 1 : 0);
            formData.append('mainCategory', data.mainCategory || '');
            formData.append('documentUrl', data.documentUrl || '');
            formData.append('iframe', 1);
            formData.append('documentType', data.documentType);
            data?.mediaCategories?.forEach((category, index) => {
                formData.append(`mediaCategories[${index}]`, category);
            });
            formData.append('thumbnail', data?.thumbnail?.id || '');
            formData.append('beginDate', data?.beginDate || '');
            formData.append('endDate', data?.endDate || '');
            data?.mediaLinks?.forEach((link, index) => {
                formData.append(`mediaLinks[${index}]`, link?.id);
            });

            const result = await axios.post('/medias', formData);

            return { result: true, media: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editIframeMedia: async (id, data) => {
        try {
            const formData = new FormData();

            formData.append('title', data?.title);
            formData.append('subtitle', data?.subtitle);
            formData.append('alt', data?.alt);
            formData.append('legend', data?.legend);
            formData.append('description', data?.description);
            formData.append('active', data.active ? 1 : 0);
            formData.append('mainCategory', data.mainCategory || '');
            formData.append('documentUrl', data.documentUrl || '');
            formData.append('iframe', 1);
            formData.append('documentType', data.documentType);
            data?.mediaCategories?.forEach((category, index) => {
                formData.append(`mediaCategories[${index}]`, category);
            });
            formData.append('thumbnail', data?.thumbnail?.id || '');
            formData.append('beginDate', data?.beginDate || '');
            formData.append('endDate', data?.endDate || '');
            data?.mediaLinks?.forEach((link, index) => {
                formData.append(`mediaLinks[${index}]`, link?.id);
            });

            const result = await axios.post(`/medias/${id}`, formData);

            return { result: true, media: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editMedia: async (id, data) => {
        try {
            const formData = new FormData();

            formData.append('title', data?.title);
            formData.append('subtitle', data?.subtitle);
            formData.append('alt', data?.alt);
            formData.append('legend', data?.legend);
            formData.append('description', data?.description);
            formData.append('active', data.active ? 1 : 0);
            formData.append('mainCategory', data.mainCategory || '');
            formData.append('documentUrl', data.documentUrl || '');
            formData.append('iframe', 0);
            formData.append('documentType', data.documentType || '');
            formData.append('thumbnail', data?.thumbnail?.id || '');
            data?.mediaCategories?.forEach((category, index) => {
                formData.append(`mediaCategories[${index}]`, category);
            });

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
