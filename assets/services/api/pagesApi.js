import axios from './config';

const pagesApi = {
    getPages: async () => {
        try {
            const result = await axios.get('/pages');

            return { result: true, pages: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOnePage: async (id) => {
        try {
            const result = await axios.get(`/pages/${id}`);

            return { result: true, page: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createPage: async (data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('title', data.title);

            data.pageBlocks.forEach((block, index) => {
                formData.append(`pageBlocks[${index}][content]`, block.content);
            });

            const result = await axios.post('/pages', formData);

            return { result: true, page: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editPage: async (id, data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('title', data.title);

            data.pageBlocks.forEach((block, index) => {
                formData.append(`pageBlocks[${index}][content]`, block.content);
            });

            const result = await axios.post(`/pages/${id}`, formData);

            return { result: true, page: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deletePage: async (id) => {
        try {
            await axios.delete(`/pages/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    duplicatePage: async (id) => {
        try {
            await axios.post(`/pages/${id}/duplicate`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default pagesApi;
