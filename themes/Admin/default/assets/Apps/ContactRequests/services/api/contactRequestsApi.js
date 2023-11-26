import { Constant } from '@/AdminService/Constant';
import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';
import { constructFormData } from '@Services/utils/constructFormData';
import { Crud } from '@/AdminService/Crud';

var controller = null;

const contactRequestsApi = {
    getContactRequests: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, Crud?.contactRequests?.list?.filtersData, params);

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

    createContactRequest: async (values) => {
        try {
            const result = await axios.post('/contact-requests', constructFormData({ values, dataFields: Crud?.contactRequests?.add?.api?.dataFields }));

            return { result: true, contactRequest: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editContactRequest: async (id, values) => {
        try {
            const result = await axios.post(`/contact-requests/${id}`, constructFormData({ values, dataFields: Crud?.contactRequests?.edit?.api?.dataFields }));

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
