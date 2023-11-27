import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';
import { Crud } from '@/AdminService/Crud';
import { constructFormData } from '@Services/utils/constructFormData';
import { Constant } from '@/AdminService/Constant';

const DEFAULT_PATH = '/vouchers';

var controller = null;

const vouchersApi = {
    getVouchers: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, Crud?.vouchers?.list?.filtersData, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get(DEFAULT_PATH, {
                params: params,
                signal: controller.signal,
            });

            controller = null;

            return { result: true, vouchers: result.data.results, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, vouchers: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllVouchers: async (filters) => {
        try {
            let params = { 'filters[page]': 0 };

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            const result = await axios.get(DEFAULT_PATH, { params: params });

            return { result: true, vouchers: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneVoucher: async (id) => {
        try {
            const result = await axios.get(`${DEFAULT_PATH}/${id}`);

            return { result: true, voucher: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createVoucher: async (values) => {
        try {
            const result = await axios.post(DEFAULT_PATH, constructFormData({ values, dataFields: Crud?.vouchers?.add?.api?.dataFields }));

            return { result: true, voucher: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editVoucher: async (id, values) => {
        try {
            const result = await axios.post(`${DEFAULT_PATH}/${id}`, constructFormData({ values, dataFields: Crud?.vouchers?.edit?.api?.dataFields }));

            return { result: true, voucher: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteVoucher: async (id) => {
        try {
            await axios.delete(`${DEFAULT_PATH}/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default vouchersApi;
