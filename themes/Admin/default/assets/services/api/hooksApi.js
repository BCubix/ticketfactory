import axios from '@Services/api/config';

const hooksApi = {
    getHooks: async () => {
        try {
            const result = await axios.get('/hooks');

            return { result: true, hooks: result?.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createHook: async (data) => {
        try {
            let formData = new FormData();

            formData.append('hookName', data.hookName);
            formData.append('moduleName', data.moduleName);

            const result = await axios.post(`/hooks`, formData);

            return { result: true, hooks: result?.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    updateHookModules: async (name, srcPosition, destPosition) => {
        try {
            const result = await axios.post(`/hooks/${name}?src=${srcPosition}&dest=${destPosition}`);

            return { result: true, hooks: result?.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    disableModule: async (name, moduleName) => {
        try {
            const result = await axios.post(`/hooks/${name}/disable?module-name=${moduleName}`);

            return { result: true, hooks: result?.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default hooksApi;
