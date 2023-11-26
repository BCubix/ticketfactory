import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';
import * as Yup from 'yup';

export const imageFormatsInitialSchema = {
    name: (initValues) => initValues?.name || '',
    active: (initValues) => initValues?.active || false,
    slug: (initValues) => initValues?.slug || '',
    width: (initValues) => initValues?.width || '',
    height: (initValues) => initValues?.height || '',
    themeUse: (initValues) => initValues?.themeUse || '',
    editSlug: false,
};

export const imageFormatsValidationSchema = {
    name: Yup.string().required('Veuillez renseigner le nom du format.').max(250, 'Le nom renseigné est trop long.'),
    slug: Yup.string().required('Veuillez renseigner le slug du format.').max(250, 'Le slug renseigné est trop long.'),
    width: Yup.number().required('Veuillez renseigner la largeur du format.').min(1, 'Veuillez renseigner une largeur valide.'),
    height: Yup.number().required('Veuillez renseigner la hauteur du format.').min(1, 'Veuillez renseigner une hauteur valide.'),
};

export const imageFormatsForm = {
    submitLine: {
        activeInput: true,
        activeLabel: "Format d'image actif active ?",
    },
    api: {
        dataFields: {
            active: { type: 'boolean' },
            name: { type: 'string' },
            slug: { type: 'slug' },
            width: { type: 'string' },
            height: { type: 'string' },
            themeUse: { type: 'boolean' },
        },
    },
    fields: [
        {
            type: 'tabs',
            keyId: 'season',
            label: 'Saison',
            fields: [
                {
                    type: 'block',
                    title: 'Informations générales',
                    keyId: 'block-general-info',
                    fields: [
                        {
                            keyId: 'input-name',
                            style: { xs: 12, sm: 6 },
                            input: {
                                name: 'name',
                                label: 'Nom',
                                inputType: 'textField',
                                required: true,
                            },
                        },
                        {
                            keyId: 'input-slug',
                            style: { xs: 12, sm: 6 },
                            input: {
                                name: 'slug',
                                label: "Slug du type d'image",
                                inputType: 'textField',
                                required: true,
                            },
                        },
                        {
                            keyId: 'input-width',
                            style: { xs: 12, sm: 6 },
                            input: {
                                name: 'width',
                                label: 'Largeur',
                                inputType: 'textField',
                                type: 'number',
                                required: true,
                            },
                        },
                        {
                            keyId: 'input-height',
                            style: { xs: 12, sm: 6 },
                            input: {
                                name: 'height',
                                label: 'Hauteur',
                                inputType: 'textField',
                                type: 'number',
                                required: true,
                            },
                        },
                    ],
                },
            ],
        },
    ],
    ...DEFAULT_CRUD_FORM_COMPONENTS,
};
