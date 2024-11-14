import { Crud } from '@/AdminService/Crud';
import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';

const DEFAULT_PATH = '/profiles';

var controller = null;

const profilesApi = {
    getProfiles: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, Crud.profiles.list.filtersData, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get(DEFAULT_PATH, {
                params: params,
                signal: controller.signal,
            });

            controller = null;

            return { result: true, profiles: result.data?.results, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, profiles: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllProfiles: async (filters) => {
        try {
            let params = { 'filters[page]': 0 };

            createFilterParams(filters, Crud?.profiles?.list?.filtersData, params);

            const result = await axios.get(DEFAULT_PATH, {
                params: params,
            });

            return { result: true, profiles: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneProfile: async (id) => {
        try {
            const result = await axios.get(`${DEFAULT_PATH}/${id}`);
            const data = copyData(result?.data);

            return { result: true, profile: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createProfile: async (values) => {
        try {
            const result = await axios.post(DEFAULT_PATH, constructFormData({ values, dataFields: Crud?.profiles?.add?.api?.dataFields }));

            return { result: true, profile: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editProfile: async (id, values) => {
        try {
            const result = await axios.post(`${DEFAULT_PATH}/${id}`, constructFormData({ values, dataFields: Crud?.profiles?.edit?.api?.dataFields }));

            return { result: true, profile: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteProfile: async (id) => {
        try {
            await axios.delete(`${DEFAULT_PATH}/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default profilesApi;
