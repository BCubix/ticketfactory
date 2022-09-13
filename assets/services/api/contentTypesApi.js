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
                            instructions:
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
                        {
                            title: 'Groupe de champs',
                            name: 'groupF',
                            fieldType: 'groupFields',
                            instructions: 'Groupe de champs.',
                            options: {
                                required: true,
                                disabled: false,
                            },
                            parameters: {
                                fields: [
                                    {
                                        title: 'Titre du block',
                                        name: 'blockTitle',
                                        fieldType: 'text',
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
                                    {
                                        title: 'TextArea',
                                        name: 'textArea',
                                        fieldType: 'textarea',
                                        instructions:
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
                                    {
                                        title: 'Nombre de place',
                                        name: 'placeNb',
                                        fieldType: 'number',
                                        instructions: 'Nombre de place pour le spectacle.',
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
                                ],
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
                        instructions:
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

/* {
    title: 'Nom du spectacle',
    name: 'spectacleName',
    fieldType: 'text',
    instructions:
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
{
    title: 'TextArea',
    name: 'textArea',
    fieldType: 'textarea',
    instructions:
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
{
    title: 'Nombre de place',
    name: 'placeNb',
    fieldType: 'number',
    instructions: 'Nombre de place pour le spectacle.',
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
    title: 'Date',
    name: 'date',
    fieldType: 'time',
    instructions: 'Nombre de place pour le spectacle.',
    options: {
        required: true,
        disabled: false,
    },
    validations: {
        disablePast: true,
        minDate: '',
        maxDate: '',
    },
},
{
    title: 'Description',
    name: 'description',
    fieldType: 'contentEditor',
    instructions: 'Description du spectacle.',
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
    title: 'Fichier',
    name: 'file',
    fieldType: 'slider',
    instructions: 'Fichiers du spectacle.',
    options: {
        required: true,
        disabled: false,
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
    instructions: 'Couleur.',
    options: {
        required: true,
        disabled: false,
    },
},
{
    title: 'Choix',
    name: 'choiceList',
    fieldType: 'choiceList',
    instructions: 'choix.',
    options: {
        required: true,
        disabled: false,
        multiple: true,
    },
    parameters: {
        choices: 'red:Red\ngreen:Green',
    },
},
{
    title: 'radio',
    name: 'radioButton',
    fieldType: 'radioButton',
    instructions: 'Radio.',
    options: {
        required: true,
        disabled: false,
    },
    parameters: {
        choices: 'red:Red\ngreen:Green',
    },
},
{
    title: 'checkbox',
    name: 'checkbox',
    fieldType: 'checkbox',
    instructions: 'Checkbox.',
    options: {
        required: true,
        disabled: false,
    },
},
{
    title: 'Switch',
    name: 'switch',
    fieldType: 'trueFalse',
    instructions: 'Switch.',
    options: {
        required: true,
        disabled: false,
    },
},
{
    title: 'Event Link',
    name: 'eventLink',
    fieldType: 'eventLink',
    instructions: 'Event Link.',
    options: {
        required: true,
        disabled: false,
    },
},
{
    title: 'Category Link',
    name: 'categoryLink',
    fieldType: 'categoryLink',
    instructions: 'Category Link.',
    options: {
        required: true,
        disabled: false,
    },
},
{
    title: 'Tag Link',
    name: 'tagLink',
    fieldType: 'tagLink',
    instructions: 'Tag Link.',
    options: {
        required: true,
        disabled: false,
    },
}, */
