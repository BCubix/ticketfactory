import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';
import * as Yup from 'yup';

export const urlInitialSchema = {
    name: (initValues) => initValues?.name || '',
    active: (initValues) => initValues?.active || false,
    slug: (initValues) => initValues?.slug || '',
    page: (initValues) => initValues?.page?.id || '',
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
            page: { type: 'string' },
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
                            style: { xs: 12, sm: 4 },
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
                            keyId: 'input-page',
                            style: { xs: 12, sm: 4 },
                            input: {
                                name: 'page',
                                label: 'Page',
                                inputType: 'selectField',
                                listName: 'pagesList',
                                getName: (item) => item.title,
                                getValue: (item) => item.id,
                            },
                        },
                        {
                            keyId: 'input-slug',
                            style: { xs: 12, sm: 4 },
                            input: {
                                name: 'slug',
                                label: 'Slug',
                                inputType: 'textField',
                                required: true,
                                custom: {
                                    helper: ({ initialValues }) => initialValues?.helper || '',
                                },
                            },
                        },
                    ],
                },
            ],
        },
    ],
    ...DEFAULT_CRUD_FORM_COMPONENTS,
};
