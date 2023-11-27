import axios from '@Services/api/config';

const languagesApi = {
    getLanguages: async () => {
        try {
            const result = await axios.get('/languages');

            return { result: true, languages: result?.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneLanguage: async (id) => {
        try {
            const result = await axios.get(`/languages/${id}`);

            return { result: true, language: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createLanguage: async (data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('name', data.name);
            formData.append('isoCode', data.isoCode);
            formData.append('locale', data.locale);
            formData.append('datetimeFormat', data.datetimeFormat);
            formData.append('dateFormat', data.dateFormat);
            formData.append('timeFormat', data.timeFormat);
            formData.append('isDefault', data.isDefault ? 1 : 0);

            const result = await axios.post('/languages', formData);

            return { result: true, languages: result?.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editLanguage: async (id, data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('name', data.name);
            formData.append('isoCode', data.isoCode);
            formData.append('locale', data.locale);
            formData.append('datetimeFormat', data.datetimeFormat);
            formData.append('dateFormat', data.dateFormat);
            formData.append('timeFormat', data.timeFormat);
            formData.append('isDefault', data.isDefault ? 1 : 0);

            const result = await axios.post(`/languages/${id}`, formData);

            return { result: true, languages: result?.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteLanguage: async (id) => {
        try {
            await axios.delete(`/languages/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default languagesApi;
