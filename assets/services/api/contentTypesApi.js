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
                                disabled: true,
                                trim: false,
                            },
                            validations: {
                                minLength: 8,
                                maxLength: 50,
                            },
                        },
                        {
                            title: 'Nombre de place',
                            name: 'placeNb',
                            fieldType: 'number',
                            instruction: 'Nombre de place pour le spectacle.',
                            options: {
                                required: true,
                                disabled: false,
                                scale: '',
                            },
                            validations: {
                                min: '',
                                max: '',
                            },
                        },
                        {
                            title: 'Description',
                            name: 'description',
                            fieldType: 'contentEditor',
                            instruction: 'Description du spectacle.',
                            options: {
                                required: true,
                                disabled: false,
                                trim: false,
                            },
                            validations: {
                                minLength: '',
                                maxLength: '',
                            },
                        },
                        {
                            title: 'Image',
                            name: 'image',
                            fieldType: 'image',
                            instruction: 'Image du spectacle.',
                            options: {
                                required: true,
                                disabled: false,
                                multiple: false,
                            },
                            validations: {
                                minLength: '',
                                maxLength: '',
                            },
                        },
                        {
                            title: 'Couleur',
                            name: 'color',
                            fieldType: 'color',
                            instruction: 'Couleur.',
                            options: {
                                required: true,
                                disabled: false,
                            },
                        },
                        {
                            title: 'Choix',
                            name: 'choiceList',
                            fieldType: 'choiceList',
                            instruction: 'choix.',
                            options: {
                                required: true,
                                disabled: false,
                                multiple: true,
                                choices: 'red:Red\ngreen:Green',
                            },
                        },
                        {
                            title: 'radio',
                            name: 'radioButton',
                            fieldType: 'radioButton',
                            instruction: 'Radio.',
                            options: {
                                required: true,
                                disabled: false,
                                choices: 'red:Red\ngreen:Green',
                            },
                        },
                        {
                            title: 'checkbox',
                            name: 'checkbox',
                            fieldType: 'checkbox',
                            instruction: 'Checkbox.',
                            options: {
                                required: true,
                                disabled: false,
                            },
                        },
                        {
                            title: 'Switch',
                            name: 'switch',
                            fieldType: 'true/false',
                            instruction: 'Switch.',
                            options: {
                                required: true,
                                disabled: false,
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
