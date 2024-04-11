import axios from '@Services/api/config';
import { getSerializationApiValue } from '../config/serializationApi';

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
                formData.append(`parameters[${index}][paramValue]`, getSerializationApiValue(parameter.type, parameter.paramValue));
            });

            const result = await axios.post('/parametres', formData);

            return { result: true, parameters: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    executeRequestButton: async (url) => {
        try {
            const result = await axios.post(url);

            return { result: true, data: result.data };
        } catch (error) {
            return { result: false };
        }
    },

    executeGetRequestButton: async (url) => {
        try {
            const result = await axios.get(url);

            return { result: true, data: result.data };
        } catch (error) {
            return { result: false };
        }
    },
};

export default parametersApi;
