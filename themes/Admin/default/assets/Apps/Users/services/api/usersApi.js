import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';
import { constructFormData } from '@Services/utils/constructFormData';

var controller = null;

const usersApi = {
    getUsers: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, Crud?.users?.list?.filtersData, params);

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

    createUser: async (values) => {
        try {
            const result = await axios.post('/users', constructFormData({ values, dataFields: Crud?.users?.add?.api?.dataFields }));

            return { result: true, user: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editUser: async (id, values) => {
        try {
            const result = await axios.post(`/users/${id}`, constructFormData({ values, dataFields: Crud?.users?.edit?.api?.dataFields }));

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
