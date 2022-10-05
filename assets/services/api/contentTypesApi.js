import axios from './config';

const serializeOptionsValidations = (element, name, formData) => {
    Object.entries(element).map(([key, value], index) => {
        if (null !== value && typeof value === 'object') {
            serializeOptionsValidations(value, `${name}[${key}][${index}]`, formData);
        } else {
            formData.append(`${name}[${index}][name]`, key);
            formData.append(`${name}[${index}][value]`, value);
        }
    });
};

const serializeData = (element, name, formData) => {
    Object.entries(element).map(([key, value]) => {
        if (null !== value && typeof value === 'object') {
            if (key === 'options' || key === 'validations') {
                serializeOptionsValidations(value, `${name}[${key}]`, formData);
            } else {
                serializeData(value, `${name}[${key}]`, formData);
            }
        } else if (null !== value && Array.isArray(value)) {
            value.forEach((el, index) => {
                serializeData(el, `${name}[${key}][${index}]`, formData);
            });
        } else {
            formData.append(`${name}[${key}]`, value);
        }
    });
};

const deserializeData = (data) => {
    const newData = data;

    newData?.fields?.forEach((field, fieldIndex) => {
        newData.fields[fieldIndex].options = field?.options?.reduce(
            (previousValue, currentValue) => ({
                ...previousValue,
                [currentValue.name]: currentValue.value,
            }),
            {}
        );

        newData.fields[fieldIndex].validations = field?.validations?.reduce(
            (previousValue, currentValue) => ({
                ...previousValue,
                [currentValue.name]: currentValue.value,
            })
        );
    });

    return newData;
};

const contentTypesApi = {
    getContentTypes: async () => {
        try {
            const result = await axios.get('/content-types');

            return { result: true, contentTypes: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneContentType: async (id) => {
        try {
            const result = await axios.get(`content-types/${id}`);

            const data = deserializeData(result.data);
            console.log(data);
            return { result: true, contentType: data };
        } catch (error) {
            console.log(error);

            return { result: false, error: error?.response?.data };
        }
    },

    createContentType: async (data) => {
        try {
            console.log(data);
            const formData = new FormData();

            formData.append('active', data.active);
            formData.append('name', data.name);

            data.fields?.forEach((el, index) => {
                serializeData(el, `fields[${index}]`, formData);
            });

            const result = await axios.post(`/content-types`, formData);

            return { result: true, contentType: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editContentType: async (id, data) => {
        try {
            console.log(data);
            const formData = new FormData();

            formData.append('active', data.active);
            formData.append('name', data.name);

            data.fields?.forEach((el, index) => {
                serializeData(el, `fields[${index}]`, formData);
            });

            const result = await axios.post(`/content-types/${id}`, formData);

            return { result: true, contentType: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteContentType: async (id) => {
        try {
            await axios.delete(`/content-types/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default contentTypesApi;
