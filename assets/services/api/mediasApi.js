import { MEDIA_FILE_PATH } from '../../Constant';
import axios from './config';

const mediasApi = {
    getMedias: async () => {
        try {
            const result = await axios.get('/medias');

            return { result: true, medias: result.data };
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
