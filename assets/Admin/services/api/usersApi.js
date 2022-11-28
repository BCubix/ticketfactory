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
    { name: 'email', sortName: 'filters[email]' },
    { name: 'firstName', sortName: 'filters[firstName]' },
    { name: 'lastName', sortName: 'filters[lastName]' },
    { name: 'role', sortName: 'filters[role]' },
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

const usersApi = {
    getUsers: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get('/users', {
                params: params,
                signal: controller.signal,
            });

            controller = null;

            return { result: true, users: result.data?.results, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, users: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getOneUser: async (id) => {
        try {
            const result = await axios.get(`/users/${id}`);

            return { result: true, user: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createUser: async (data) => {
        try {
            let formData = new FormData();

            formData.append('email', data.email);
            formData.append('firstName', data.firstName);
            formData.append('lastName', data.lastName);
            formData.append('plainPassword', data.password);

            const result = await axios.post('/users', formData);

            return { result: true, user: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editUser: async (id, data) => {
        try {
            let formData = new FormData();

            formData.append('email', data.email);
            formData.append('firstName', data.firstName);
            formData.append('lastName', data.lastName);

            if (data.password) {
                formData.append('plainPassword', data.password);
            }

            const result = await axios.post(`/users/${id}`, formData);

            return { result: true, user: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteUser: async (id) => {
        try {
            await axios.delete(`/users/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default usersApi;
