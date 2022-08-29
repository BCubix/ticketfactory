import axios from './config';

const contentTypesApi = {
    getContentTypes: async () => {
        try {
            const result = [
                {
                    id: 1,
                    name: 'spectacle',
                    active: true,
                    fields: [
                        {
                            title: 'Nom du spectacle',
                            name: 'spectacleName',
                            fieldType: 'text',
                            instruction:
                                'La longueur du nom du spectacle doit être comprise entre 8 et 50 caractères.',
                            options: {
                                required: true,
                                disabled: false,
                                trim: false,
                            },
                            validations: {
                                minLength: 8,
                                maxLength: 50,
                            },
                        },
                    ],
                },
            ];

            return { result: true, contentTypes: result };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneContentType: async (id) => {
        try {
            const result = {
                id: 1,
                name: 'spectacle',
                active: true,
                fields: [
                    {
                        title: 'Nom du spectacle',
                        name: 'spectacleName',
                        fieldType: 'text',
                        instruction:
                            'La longueur du nom du spectacle doit être comprise entre 8 et 50 caractères.',
                        options: {
                            required: true,
                            disabled: false,
                            trim: false,
                        },
                        validations: {
                            minLength: 8,
                            maxLength: 50,
                        },
                    },
                ],
            };

            return { result: true, contentType: result };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createContentType: async (data) => {
        try {
            return { result: true, contentType: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editContentType: async (id, data) => {
        try {
            return { result: true, contentType: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteContentType: async (id) => {
        try {
            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default contentTypesApi;
