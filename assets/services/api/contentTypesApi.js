import axios from './config';

const serializeOptionsValidations = (element, name, formData) => {
    Object.entries(element).map(([key, value], index) => {
        if (null !== value && typeof value === 'object') {
            serializeOptionsValidations(value, `${name}[${key}][${index}]`, formData);
        } else {
            formData.append(`${name}[${index}][name]`, key);
            formData.append(`${name}[${index}][value]`, value);
        }
    });
};

const serializeData = (element, name, formData) => {
    Object.entries(element).map(([key, value]) => {
        if (null !== value && typeof value === 'object') {
            if (key === 'options' || key === 'validations') {
                serializeOptionsValidations(value, `${name}[${key}]`, formData);
            } else {
                serializeData(value, `${name}[${key}]`, formData);
            }
        } else if (null !== value && Array.isArray(value)) {
            value.forEach((el, index) => {
                serializeData(el, `${name}[${key}][${index}]`, formData);
            });
        } else {
            console.log(`${name}[${key}]`, value);
            formData.append(`${name}[${key}]`, value || null);
        }
    });
};

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
                            helper: 'La longueur du nom du spectacle doit être comprise entre 8 et 50 caractères.',
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
                            helper: 'Groupe de champs.',
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
                                        helper: 'La longueur du nom du spectacle doit être comprise entre 8 et 50 caractères.',
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
                                        helper: 'Nombre de place pour le spectacle.',
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
                        {
                            title: 'Fichiers utiles',
                            name: 'utilsFile',
                            fieldType: 'file',
                            helper: 'Fichiers du spectacle.',
                            options: {
                                required: true,
                                disabled: false,
                            },
                            validations: {
                                minLength: '',
                                maxLength: '',
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
                        helper: 'La longueur du nom du spectacle doit être comprise entre 8 et 50 caractères.',
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
            const formData = new FormData();

            formData.append('active', data.active);
            formData.append('name', data.name);

            data.fields?.forEach((el, index) => {
                serializeData(el, `fields[${index}]`, formData);
            });

            const result = await axios.post(`/content-types`, formData);

            return { result: true, contentType: result.data };
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
    helper:
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
    helper:
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
    helper: 'Nombre de place pour le spectacle.',
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
    helper: 'Nombre de place pour le spectacle.',
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
    helper: 'Description du spectacle.',
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
    helper: 'Fichiers du spectacle.',
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
    helper: 'Couleur.',
    options: {
        required: true,
        disabled: false,
    },
},
{
    title: 'Choix',
    name: 'choiceList',
    fieldType: 'choiceList',
    helper: 'choix.',
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
    helper: 'Radio.',
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
    helper: 'Checkbox.',
    options: {
        required: true,
        disabled: false,
    },
},
{
    title: 'Switch',
    name: 'switch',
    fieldType: 'trueFalse',
    helper: 'Switch.',
    options: {
        required: true,
        disabled: false,
    },
},
{
    title: 'Event Link',
    name: 'eventLink',
    fieldType: 'eventLink',
    helper: 'Event Link.',
    options: {
        required: true,
        disabled: false,
    },
},
{
    title: 'Category Link',
    name: 'categoryLink',
    fieldType: 'categoryLink',
    helper: 'Category Link.',
    options: {
        required: true,
        disabled: false,
    },
},
{
    title: 'Tag Link',
    name: 'tagLink',
    fieldType: 'tagLink',
    helper: 'Tag Link.',
    options: {
        required: true,
        disabled: false,
    },
}, */
