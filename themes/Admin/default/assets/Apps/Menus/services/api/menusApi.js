import axios from '@Services/api/config';
import { copyData } from '@Services/utils/copyData';
import { sortTranslatedObject } from '@Services/utils/translationUtils';
import { constructFormData } from '@Services/utils/constructFormData';
import { Crud } from '@/AdminService/Crud';

const menusApi = {
    getMenus: async () => {
        try {
            const result = await axios.get('/menus');

            const translatedList = sortTranslatedObject(result.data || []);

            return { result: true, menus: translatedList };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createMenu: async (values) => {
        try {
            const result = await axios.post('/menus', constructFormData({ values, dataFields: Crud?.menus?.add?.api?.dataFields }));

            return { result: true, menu: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    updateMenu: async (id, values) => {
        try {
            const result = await axios.post(`/menus/${id}`, constructFormData({ values, dataFields: Crud?.menus?.edit?.api?.dataFields }));

            return { result: true, menu: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteMenu: async (id) => {
        try {
            await axios.delete(`/menus/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getTranslated: async (id, languageId) => {
        try {
            const result = await axios.get(`/menus/${id}/translated/${languageId}`);
            let data = copyData(result?.data);

            return { result: true, menu: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default menusApi;
