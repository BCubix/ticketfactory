import axios from './config';

const FILTERS_SORT_TAB = [
    { name: 'active', sortName: 'filters[active]' },
    { name: 'firstName', sortName: 'filters[firstName]' },
    { name: 'lastName', sortName: 'filters[lastName]' },
    { name: 'email', sortName: 'filters[email]' },
    { name: 'phone', sortName: 'filters[phone]' },
    { name: 'subject', sortName: 'filters[subject]' },
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

const contactRequestsApi = {
    getContactRequests: async (filters) => {
        try {
            let params = {};

            FILTERS_SORT_TAB.forEach((element) => {
                const filter = filters[element.name];

                if (filter) {
                    if (element.transformFilter) {
                        element.transformFilter(params, filter);
                    } else {
                        params[element.sortName] = filter;
                    }
                }
            });

            const result = await axios.get('/contact-requests', { params: params });

            return {
                result: true,
                contactRequests: result.data?.results,
                total: result?.data?.total,
            };
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
