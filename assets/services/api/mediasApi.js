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

    uploadFile: (file, onProgress) => {
        try {
            const url = '/admin/api/_uploader/media/upload';

            return new Promise((res, rej) => {
                const token = localStorage.getItem('token');

                const xhr = new XMLHttpRequest();

                xhr.open('POST', url);
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);

                xhr.onload = () => {
                    const resp = JSON.parse(xhr.responseText);

                    res(resp.secure_url);
                };

                xhr.onerror = (evt) => rej(evt);
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentage = (event.loaded / event.total) * 100;
                        onProgress(Math.round(percentage));
                    }
                };

                const formData = new FormData();
                formData.append('file', file);

                xhr.send(formData);
            });
        } catch (e) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default mediasApi;
