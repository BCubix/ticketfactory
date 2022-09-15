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
                            id: 1,
                            name: 'Premier menu',
                            menus: [
                                {
                                    name: 'page 1',
                                    menuType: 'page',
                                    elementId: 1,
                                    subMenu: [
                                        {
                                            name: 'page 2',
                                            menuType: 'page',
                                            elementId: 2,
                                            subMenu: [],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 2,
                    name: 'Deuxième menu',
                    menus: [
                        {
                            name: 'page 1',
                            menuType: 'page',
                            elementId: 1,
                            subMenu: [
                                {
                                    name: 'page 2',
                                    menuType: 'page',
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
