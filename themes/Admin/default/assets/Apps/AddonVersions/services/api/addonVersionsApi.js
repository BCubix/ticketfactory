import axios from '@Services/api/config';

const DEFAULT_PATH = '/addon-versions';

const addonVersionsApi = {
    getAddonVersions: async () => {
        try {
            const token = localStorage.getItem('marketplace_token');

            const result = await axios.get(`${DEFAULT_PATH}`, {
                params: { marketplaceToken: token },
            });

            return { result: true, addonVersions: result?.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    updateModule: async (name, backupDatabase) => {
        try {
            const token = localStorage.getItem('marketplace_token');

            await axios.post(`${DEFAULT_PATH}/modules/${name}`, {
                marketplaceToken: token,
                backupDatabase: backupDatabase ? 1 : 0,
            });

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    updateAllModules: async (backupDatabase) => {
        try {
            const token = localStorage.getItem('marketplace_token');

            await axios.post(`${DEFAULT_PATH}/modules`, {
                marketplaceToken: token,
                backupDatabase: backupDatabase ? 1 : 0,
            });

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    updateTheme: async (name) => {
        try {
            const token = localStorage.getItem('marketplace_token');

            await axios.post(`${DEFAULT_PATH}/themes/${name}`, {
                marketplaceToken: token,
            });

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    updateCore: async (backupDatabase) => {
        try {
            const token = localStorage.getItem('marketplace_token');

            await axios.post(`${DEFAULT_PATH}/core`, {
                marketplaceToken: token,
                backupDatabase: backupDatabase ? 1 : 0,
            });

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default addonVersionsApi;
