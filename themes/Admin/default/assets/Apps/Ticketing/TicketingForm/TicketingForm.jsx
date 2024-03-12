import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';
import * as Yup from 'yup';

export const ticketingInitialSchema = {
    active: (initValues) => initValues?.active || false,
    name: (initValues) => initValues?.name || '',
    module: (initialValues) => initialValues?.module?.id || initialValues?.module || '',
    data: (initialValues) => (initialValues ? JSON.parse(initialValues?.data) : []),
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
            data: {
                function: ({ values, formData }) => {
                    formData.append('data', JSON.stringify(values.data));
                },
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
