import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';
import * as Yup from 'yup';
import { Constant } from '@/AdminService/Constant';

export const redirectionsInitialSchema = {
    active: (initValues) => initValues?.active || false,
    redirectType: (initValues) => initValues?.redirectType || '',
    redirectFrom: (initValues) => initValues?.redirectFrom || '',
    redirectTo: (initValues) => initValues?.redirectTo || '',
};

export const redirectionsValidationSchema = {
    redirectType: Yup.string().required('Veuillez renseigner le type de redirection.'),
    redirectFrom: Yup.string()
        .required("Veuillez renseigner l'url à rediriger.")
        .max(1000, "l'url renseigné est trop longue.")
        .matches(/^(www.)?[-a-zA-Z0-9@:%._+/~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/, 'Url invalide'),
    redirectTo: Yup.string()
        .required("Veuillez renseigner l'url de destination.")
        .max(1000, "l'url renseigné est trop longue.")
        .matches(/^(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/, 'Url invalide'),
};

export const redirectionsForm = {
    submitLine: {
        activeInput: true,
        activeLabel: 'Redirection active ?',
    },
    api: {
        dataFields: {
            active: { type: 'boolean' },
            redirectType: { type: 'string' },
            redirectFrom: { type: 'string' },
            redirectTo: { type: 'string' },
        },
    },
    fields: [
        {
            type: 'tabs',
            keyId: 'redirection',
            label: 'Redirection',
            fields: [
                {
                    type: 'block',
                    title: 'Informations générales',
                    keyId: 'block-general-info',
                    fields: [
                        {
                            keyId: 'input-redirectType',
                            style: { xs: 12, md: 6, lg: 4 },
                            input: {
                                name: 'redirectType',
                                label: 'Type de redirection',
                                inputType: 'selectField',
                                inputList: Constant.REDIRECTION_TYPES,
                                listName: 'inputList',
                                getName: (item) => item.label,
                                getValue: (item) => item.value,
                                required: true,
                            },
                        },
                        {
                            keyId: 'input-redirectFrom',
                            style: { xs: 12, md: 6, lg: 4 },
                            input: {
                                name: 'redirectFrom',
                                label: 'Rediriger',
                                inputType: 'textField',
                                required: true,
                            },
                        },
                        {
                            keyId: 'input-redirectTo',
                            style: { xs: 12, md: 6, lg: 4 },
                            input: {
                                name: 'redirectTo',
                                label: 'Vers',
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
