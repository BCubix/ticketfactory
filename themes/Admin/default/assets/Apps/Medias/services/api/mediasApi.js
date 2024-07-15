import { Constant } from '@/AdminService/Constant';
import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';
import { Crud } from '@/AdminService/Crud';

var controller = null;

const mediasApi = {
    getMedias: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, Crud?.medias?.list?.filtersData, params);

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

            createFilterParams(filters, Crud?.medias?.list?.filtersData, params);

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
            formData.append('alt', data?.alt || '');
            formData.append('legend', data?.legend || '');
            formData.append('active', data.active ? 1 : 0);
            formData.append('mainCategory', data?.mainCategory?.id || data?.mainCategory || '');
            formData.append('documentUrl', data.documentUrl || '');
            formData.append('thumbnail', data?.thumbnail?.id || '');
            formData.append('iframe', 1);
            formData.append('documentType', data.documentType);
            data?.mediaCategories?.forEach((category, index) => {
                const valueToAppend = category.id ? category.id : category;
                formData.append(`mediaCategories[${index}]`, valueToAppend);
            });

            data?.imageFormats?.forEach((format, index) => {
                const valueToAppend = format.id ? format.id : format;
                formData.append(`imageFormats[${index}]`, valueToAppend);
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
            formData.append('alt', data?.alt || '');
            formData.append('legend', data?.legend || '');
            formData.append('active', data.active ? 1 : 0);
            formData.append('mainCategory', data?.mainCategory?.id || data?.mainCategory || '');
            formData.append('documentUrl', data.documentUrl || '');
            formData.append('thumbnail', data?.thumbnail?.id || '');
            formData.append('iframe', 1);
            formData.append('documentType', data.documentType);
            data?.mediaCategories?.forEach((category, index) => {
                const valueToAppend = category.id ? category.id : category;
                formData.append(`mediaCategories[${index}]`, valueToAppend);
            });

            data?.imageFormats?.forEach((format, index) => {
                const valueToAppend = format.id ? format.id : format;
                formData.append(`imageFormats[${index}]`, valueToAppend);
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
            formData.append('alt', data?.alt || '');
            formData.append('legend', data?.legend || '');
            formData.append('active', data.active ? 1 : 0);
            formData.append('mainCategory', data?.mainCategory?.id || data?.mainCategory || '');
            formData.append('documentUrl', data.documentUrl || '');
            formData.append('thumbnail', data?.thumbnail?.id || '');
            formData.append('iframe', data.iframe ? 1 : 0);
            formData.append('documentType', data.documentType || '');
            data?.mediaCategories?.forEach((category, index) => {
                const valueToAppend = category.id ? category.id : category;
                formData.append(`mediaCategories[${index}]`, valueToAppend);
            });

            data?.imageFormats?.forEach((format, index) => {
                const valueToAppend = format.id ? format.id : format;
                formData.append(`imageFormats[${index}]`, valueToAppend);
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
