import axios from './config';

const parametersApi = {
    getParameters: async () => {
        try {
            const result = await axios.get('/parametres');

            return { result: true, parameters: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editParameters: async (data) => {
        try {
            let formData = new FormData();

            data.parameters.forEach((parameter, index) => {
                formData.append(`parameters[${index}][value]`, parameter.value);
            });

            const result = await axios.post('/parametres', formData);

            return { result: true, parameters: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default parametersApi;