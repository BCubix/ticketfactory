import axios from '@Services/api/config';

const parametersApi = {
    getParameters: async () => {
        try {
            const result = await axios.get('/parametres');

            return { result: true, parameters: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getParameterValueByKey: async (key) => {
        try {
            const result = await axios.get(`/parametres/${key}`);

            return { result: true, paramValue: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editParameters: async (data) => {
        try {
            let formData = new FormData();

            data.parameters.forEach((parameter, index) => {
                formData.append(`parameters[${index}][paramKey]`, parameter.paramKey);
                formData.append(`parameters[${index}][paramValue]`, parameter.paramValue || '');
            });

            const result = await axios.post('/parametres', formData);

            return { result: true, parameters: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default parametersApi;
