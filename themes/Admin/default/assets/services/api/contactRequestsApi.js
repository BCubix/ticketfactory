import { Constant } from "@/AdminService/Constant";
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

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get('/contact-requests', {
                params: params,
                signal: controller.signal,
            });

            controller = null;

            return {
                result: true,
                contactRequests: result.data?.results,
                total: result?.data?.total,
            };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, contactRequests: [], total: 0 };
            }

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
