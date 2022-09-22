import axios from './config';

const menusApi = {
    getMenus: async () => {
        try {
            //const result = await axios.get('/menus');
            const result = [
                {
                    id: 1,
                    name: 'Premier menu',
                    menus: [
                        {
                            name: 'Salle N°1',
                            menuType: 'rooms',
                            menuTypeLabel: 'Salle',
                            elementId: 1,
                            subMenu: [
                                {
                                    name: 'Salle N°2',
                                    menuType: 'rooms',
                                    menuTypeLabel: 'Salle',
                                    elementId: 2,
                                    subMenu: [],
                                },
                            ],
                        },
                    ],
                },
            ];

            return { result: true, menus: result };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default menusApi;
