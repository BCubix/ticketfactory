import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';
import * as Yup from 'yup';

const CUSTOMER_TYPE = [
    { value: 'M.', label: 'Monsieur' },
    { value: 'Mme', label: 'Madame' },
];

export const customersInitialSchema = {
    firstName: (initValues) => initValues?.firstName || '',
    lastName: (initValues) => initValues?.lastName || '',
    email: (initValues) => initValues?.email || '',
    civility: (initValues) => initValues?.civility || '',
    plainPassword: '',
    confirmPassword: '',
    active: (initValues) => initValues?.active || false,
    isNewCustomer: (initialValues) => !Boolean(initialValues),
};

export const customersValidationSchema = {
    firstName: Yup.string().required('Veuillez renseigner le prénom.'),
    lastName: Yup.string().required('Veuillez renseigner le nom.'),
    email: Yup.string().email('Email invalide.').required("Veuillez renseigner l'adresse email."),
    civility: Yup.string().required('Veuillez renseigner la civilité du client'),
    plainPassword: Yup.string().when('isNewCustomer', (isNewCustomer) => {
        let test = isNewCustomer ? Yup.string().required('Veuillez renseigner un mot de passe') : Yup.string().nullable();

        return test
            .min(10, 'Votre mot de passe doit contenir au moins 10 caractères.')
            .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{9,}$/,
                'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spéciale.'
            );
    }),
    confirmPassword: Yup.string().when('plainPassword', (plainPassword) => {
        if (plainPassword) {
            return Yup.string()
                .oneOf([Yup.ref('plainPassword')], 'Le mot de passe ne correspond pas.')
                .required('Veuillez confirmer le mot de passe.');
        }
    }),
};

export const customersForm = {
    submitLine: {
        activeInput: true,
        activeLabel: 'Utilisateur actif ?',
    },
    api: {
        dataFields: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
            civility: { type: 'string' },
            active: { type: 'boolean' },
            plainPassword: {
                function: ({ values, formData }) => {
                    if (values.plainPassword && values.confirmPassword) {
                        formData.append('plainPassword', values.plainPassword);
                    }
                },
            },
        },
    },
    fields: [
        {
            type: 'tabs',
            keyId: 'user',
            label: 'Utilisateur',
            fields: [
                {
                    type: 'block',
                    title: 'Informations générales',
                    keyId: 'block-general-info',
                    fields: [
                        {
                            keyId: 'input-email',
                            style: { xs: 12 },
                            input: {
                                name: 'email',
                                label: 'Email',
                                inputType: 'textField',
                                required: true,
                            },
                        },
                        {
                            keyId: 'input-civility',
                            style: { xs: 12, sm: 2 },
                            input: {
                                name: 'civility',
                                label: 'Titre',
                                inputType: 'selectField',
                                inputList: CUSTOMER_TYPE,
                                listName: 'inputList',
                                getName: (item) => item.label,
                                getValue: (item) => item.value,
                                required: true,
                            },
                        },
                        {
                            keyId: 'input-firstName',
                            style: { xs: 12, sm: 5 },
                            input: {
                                name: 'firstName',
                                label: 'Prénom',
                                inputType: 'textField',
                                required: true,
                            },
                        },
                        {
                            keyId: 'input-lastName',
                            style: { xs: 12, sm: 5 },
                            input: {
                                name: 'lastName',
                                label: 'Nom',
                                inputType: 'textField',
                                required: true,
                            },
                        },
                    ],
                },
                {
                    type: 'block',
                    title: 'Sécurité',
                    keyId: 'block-security',
                    fields: [
                        {
                            keyId: 'input-plainPassword',
                            style: { xs: 12 },
                            input: {
                                name: 'plainPassword',
                                label: 'Mot de passe',
                                inputType: 'textField',
                                type: 'password',
                            },
                        },
                        {
                            keyId: 'input-confirmPassword',
                            style: { xs: 12 },
                            input: {
                                name: 'confirmPassword',
                                label: 'Confirmer le mot de passe',
                                inputType: 'textField',
                                type: 'password',
                            },
                        },
                    ],
                },
            ],
        },
    ],
    ...DEFAULT_CRUD_FORM_COMPONENTS,
};
