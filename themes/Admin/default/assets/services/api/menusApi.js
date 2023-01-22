import axios from '@Services/api/config';
import { copyData } from '@Services/utils/copyData';
import { sortTranslatedObject } from '@Services/utils/translationUtils';

const serializeMenuData = (element, name, formData, datas) => {
    formData.append(`${name}[name]`, element.name);
    formData.append(`${name}[menuType]`, element.menuType);
    formData.append(`${name}[value]`, element.value);
    formData.append(`${name}[lang]`, element.lang || datas.lang || '');
    formData.append(`${name}[languageGroup]`, element.languageGroup || '');

    element?.children?.forEach((el, index) => {
        serializeMenuData(el, `${name}[children][${index}]`, formData, datas);
    });
};

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

    createMenu: async (data) => {
        try {
            let formData = new FormData();

            formData.append('name', data.name);
            formData.append('menuType', 'none');
            formData.append('lang', data.lang || '');
            formData.append('languageGroup', data.languageGroup || '');

            const result = await axios.post('/menus', formData);

            return { result: true, menu: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    updateMenu: async (id, data) => {
        try {
            let formData = new FormData();

            formData.append('name', data.name);
            formData.append('menuType', data.menuType || 'none');
            formData.append('value', data.value || '');
            formData.append('lang', data.lang || '');
            formData.append('languageGroup', data.languageGroup || '');

            data?.children?.forEach((el, index) => {
                serializeMenuData(el, `children[${index}]`, formData, data);
            });

            const result = await axios.post(`/menus/${id}`, formData);

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
