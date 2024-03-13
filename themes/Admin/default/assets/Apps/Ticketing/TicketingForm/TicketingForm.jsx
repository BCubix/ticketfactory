import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';
import * as Yup from 'yup';

export const ticketingInitialSchema = {
    active: (initValues) => initValues?.active || false,
    name: (initValues) => initValues?.name || '',
    type: (initValues) => initValues?.type || 'api',
    module: (initialValues) => initialValues?.module?.id || initialValues?.module || 27,
    data: (initialValues) => initialValues?.data || {},
};

export const ticketingValidationSchema = {
    name: Yup.string().required('Veuillez renseigner le nom de la billetterie.').max(250, 'Le nom renseigné est trop long.'),
};

export const ticketingForm = {
    submitLine: {
        activeInput: true,
        activeLabel: 'Billetterie active ?',
    },
    api: {
        dataFields: {
            active: { type: 'boolean' },
            name: { type: 'string' },
            module: { type: 'string' },
            type: { type: 'string' },
            data: {
                function: ({ values, formData }) => {
                    formData.append('data[login]', 'test');
                },
            },
        },
    },
    ticketingList: {
        default: {
            use: {
                api: false,
                iframe: false,
                external: true,
            },
            formFields: {
                external: [
                    {
                        keyId: 'input-link',
                        style: { xs: 12, sm: 6, md: 4 },
                        input: {
                            name: 'name',
                            label: 'Nom',
                            inputType: 'textField',
                            required: true,
                        },
                    },
                ],
            },
        },
    },
    fields: [
        {
            type: 'tabs',
            keyId: 'ticketing',
            label: 'Billetterie',
            fields: [
                {
                    type: 'block',
                    title: 'Informations générales',
                    keyId: 'block-general-info',
                    fields: [
                        {
                            keyId: 'input-name',
                            style: { xs: 12, sm: 6, md: 4 },
                            input: {
                                name: 'name',
                                label: 'Nom',
                                inputType: 'textField',
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
