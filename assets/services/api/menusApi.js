import axios from './config';

const serializeMenuData = (element, name, formData) => {
    formData.append(`${name}[name]`, element.name);
    formData.append(`${name}[menuType]`, element.menuType);
    formData.append(`${name}[value]`, element.value);

    element?.children?.forEach((el, index) => {
        serializeMenuData(el, `${name}[children][${index}]`, formData);
    });
};

const menusApi = {
    getMenus: async () => {
        try {
            const result = await axios.get('/menus');

            return { result: true, menus: result.data || [] };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createMenu: async (data) => {
        try {
            let formData = new FormData();

            formData.append('name', data.name);

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
            formData.append('menuType', data.menuType || null);
            formData.append('value', data.value || null);

            data?.children?.forEach((el, index) => {
                serializeMenuData(el, `children[${index}]`, formData);
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
};

export default menusApi;
