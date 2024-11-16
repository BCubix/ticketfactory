import axios from '@Services/api/config';

const DEFAULT_PATH = '/roles';

const rolesApi = {
    getRoles: async () => {
        try {
            let params = { 'filters[page]': 0 };

            const result = await axios.get(DEFAULT_PATH, {
                params: params,
            });

            return { result: true, roles: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default rolesApi;
