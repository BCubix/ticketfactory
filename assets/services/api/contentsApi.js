import axios from './config';

const contentsApi = {
    getContents: async () => {
        try {
            const result = [
                {
                    id: 1,
                    active: true,
                    type: 'Spectacle',
                    fields: [
                        {
                            name: 'spectacleName',
                            value: 'spectacle',
                        },
                    ],
                },
            ];

            return { result: true, contents: result };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneContent: async (id) => {
        try {
            const result = {
                id: 1,
                active: true,
                type: 'Spectacle',
                fields: [
                    {
                        name: 'spectacleName',
                        value: 'spectacle',
                    },
                ],
            };

            return { result: true, content: result };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createContent: async (data) => {
        try {
            return { result: true, content: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editContent: async (id, data) => {
        try {
            return { result: true, content: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteContent: async (id) => {
        try {
            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default contentsApi;
