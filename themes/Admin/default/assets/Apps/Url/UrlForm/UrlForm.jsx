import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';
import * as Yup from 'yup';

export const urlInitialSchema = {
    name: (initValues) => initValues?.name || '',
    active: (initValues) => initValues?.active || false,
    slug: (initValues) => initValues?.slug || '',
};

export const urlValidationSchema = {
    name: Yup.string().required("Veuillez renseigner le nom de l'url.").max(250, 'Le nom renseigné est trop long.'),
    slug: Yup.string().required("Veuillez renseigner le slug de l'url.").max(250, 'Le nom renseigné est trop long.'),
};

export const urlForm = {
    submitLine: {
        activeInput: true,
        activeLabel: 'Url active ?',
    },
    api: {
        dataFields: {
            active: { type: 'boolean' },
            name: { type: 'string' },
            slug: { type: 'string' },
        },
    },
    fields: [
        {
            type: 'tabs',
            keyId: 'url',
            label: 'Url',
            fields: [
                {
                    type: 'block',
                    title: 'Informations générales',
                    keyId: 'block-general-info',
                    fields: [
                        {
                            keyId: 'input-name',
                            style: { xs: 12 },
                            inputs: [
                                {
                                    name: 'name',
                                    label: 'Nom',
                                    inputType: 'textField',
                                    required: true,
                                },
                            ],
                        },
                        {
                            keyId: 'input-slug',
                            style: { xs: 12 },
                            inputs: [
                                {
                                    name: 'slug',
                                    label: 'Slug',
                                    inputType: 'textField',
                                    required: true,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    ...DEFAULT_CRUD_FORM_COMPONENTS,
};
