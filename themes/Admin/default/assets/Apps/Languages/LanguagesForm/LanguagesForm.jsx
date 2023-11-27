import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';
import * as Yup from 'yup';

export const languagesInitialSchema = {
    name: (initValues) => initValues?.name || '',
    isoCode: (initValues) => initValues?.isoCode || '',
    locale: (initValues) => initValues?.locale || '',
    datetimeFormat: (initValues) => initValues?.datetimeFormat || '',
    dateFormat: (initValues) => initValues?.dateFormat || '',
    timeFormat: (initValues) => initValues?.timeFormat || '',
    isDefault: (initValues) => initValues?.isDefault || false,
    active: (initValues) => initValues?.active || false,
};

export const languagesValidationSchema = {
    name: Yup.string().required('Veuillez renseigner le nom de votre langue.'),
    isoCode: Yup.string().required("Veuillez renseigner l'identifiant de la nouvelle langue."),
    locale: Yup.string().required('Veuillez renseigner le code locale de la nouvelle langue.'),
};

export const languagesForm = {
    submitLine: {
        activeInput: true,
        activeLabel: 'Langue active ?',
    },
    api: {
        dataFields: {
            active: { type: 'boolean' },
            name: { type: 'string' },
            isoCode: { type: 'string' },
            locale: { type: 'string' },
            datetimeFormat: { type: 'string' },
            dateFormat: { type: 'string' },
            timeFormat: { type: 'string' },
            isDefault: { type: 'boolean' },
        },
    },
    fields: [
        {
            type: 'tabs',
            keyId: 'language',
            label: 'Langue',
            fields: [
                {
                    type: 'block',
                    title: 'Informations générales',
                    keyId: 'block-general-info',
                    fields: [
                        {
                            keyId: 'input-name',
                            style: { xs: 12, md: 6 },
                            input: {
                                name: 'name',
                                label: 'Nom',
                                inputType: 'textField',
                                required: true,
                            },
                        },
                        {
                            keyId: 'input-isoCode',
                            style: { xs: 12, md: 3 },
                            input: {
                                name: 'isoCode',
                                label: 'Code ISO (FR, EN, ES, ...)',
                                inputType: 'textField',
                                required: true,
                            },
                        },
                        {
                            keyId: 'input-locale',
                            style: { xs: 12, sm: 3 },
                            input: {
                                name: 'locale',
                                label: 'Locale',
                                inputType: 'textField',
                                required: true,
                            },
                        },
                        {
                            keyId: 'input-lastName',
                            style: { xs: 12, md: 6 },
                            input: {
                                name: 'isDefault',
                                label: 'Langue par défaut ?',
                                inputType: 'checkbox',
                            },
                        },
                    ],
                },
                {
                    type: 'block',
                    title: 'Format des dates',
                    keyId: 'block-date-formats',
                    fields: [
                        {
                            keyId: 'input-datetimeFormat',
                            style: { xs: 12, md: 6 },
                            input: {
                                name: 'datetimeFormat',
                                label: 'Date & Heure',
                                inputType: 'textField',
                                required: true,
                            },
                        },
                        {
                            keyId: 'input-dateFormat',
                            style: { xs: 12, md: 3 },
                            input: {
                                name: 'dateFormat',
                                label: 'Date',
                                inputType: 'textField',
                                required: true,
                            },
                        },
                        {
                            keyId: 'input-timeFormat',
                            style: { xs: 12, md: 3 },
                            input: {
                                name: 'timeFormat',
                                label: 'Heure',
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
