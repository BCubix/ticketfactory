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

    updateHook: async (name, data) => {
        try {
            let formData = new FormData();

            data.modules.forEach((module, index) => {
                formData.append(`modules[${index}][name]`, module.name);
            });

            const result = await axios.post(`/hooks/${name}`, formData);

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
    }
};

export default hooksApi;
