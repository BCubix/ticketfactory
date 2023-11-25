import { Constant } from '@/AdminService/Constant';
import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';
import { Crud } from '@/AdminService/Crud';

var controller = null;

const redirectionsApi = {
    getRedirections: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, Crud?.redirections?.list?.filtersData, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get('/redirections', {
                params: params,
                signal: controller.signal,
            });

            controller = null;

            return {
                result: true,
                redirections: result?.data?.results,
                total: result?.data?.total,
            };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, redirections: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getOneRedirection: async (id) => {
        try {
            const result = await axios.get(`/redirections/${id}`);

            return { result: true, redirection: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createRedirection: async (data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('redirectType', data.redirectType);
            formData.append('redirectFrom', data.redirectFrom);
            formData.append('redirectTo', data.redirectTo);

            const result = await axios.post('/redirections', formData);

            return { result: true, redirection: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editRedirection: async (id, data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('redirectType', data.redirectType);
            formData.append('redirectFrom', data.redirectFrom);
            formData.append('redirectTo', data.redirectTo);

            const result = await axios.post(`/redirections/${id}`, formData);

            return { result: true, redirection: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteRedirection: async (id) => {
        try {
            await axios.delete(`/redirections/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default redirectionsApi;
