import axios from './config';

const contentTypeFieldsApi = {
    getContentTypeFields: async () => {
        try {
            const result = await axios.get('/content-type-fields');

            return { result: true, contentTypeFields: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneContentTypeFields: async (id) => {
        try {
            const result = await axios.get(`/content-type-fields/${id}`);

            return { result: true, contentTypeField: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default contentTypeFieldsApi;
