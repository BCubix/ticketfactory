import axios from './config';

const contactRequestsApi = {
    getContactRequests: async () => {
        try {
            const result = await axios.get('/contact-requests');

            return { result: true, contactRequests: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneContactRequest: async (id) => {
        try {
            const result = await axios.get(`/contact-requests/${id}`);

            return { result: true, contactRequest: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createContactRequest: async (data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('firstName', data.firstName);
            formData.append('lastName', data.lastName);
            formData.append('email', data.email);
            formData.append('phone', data.phone);
            formData.append('subject', data.subject);
            formData.append('message', data.message);

            const result = await axios.post('/contact-requests', formData);

            return { result: true, contactRequest: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editContactRequest: async (id, data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('firstName', data.firstName);
            formData.append('lastName', data.lastName);
            formData.append('email', data.email);
            formData.append('phone', data.phone);
            formData.append('subject', data.subject);
            formData.append('message', data.message);

            const result = await axios.post(`/contact-requests/${id}`, formData);

            return { result: true, contactRequest: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteContactRequest: async (id) => {
        try {
            await axios.delete(`/contact-requests/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default contactRequestsApi;
