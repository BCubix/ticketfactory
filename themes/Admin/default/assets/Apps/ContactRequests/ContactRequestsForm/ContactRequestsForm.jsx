import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';
import * as Yup from 'yup';

export const contactRequestsInitialSchema = {
    active: (initValues) => initValues?.active || false,
    firstName: (initValues) => initValues?.firstName || '',
    lastName: (initValues) => initValues?.lastName || '',
    email: (initValues) => initValues?.email || '',
    phone: (initValues) => initValues?.phone || '',
    subject: (initValues) => initValues?.subject || '',
    message: (initValues) => initValues?.message || '',
};

export const contactRequestsValidationSchema = {
    email: Yup.string().required("Veuillez renseigner l'adresse email.").email('Email invalide'),
    message: Yup.string().required('Veuillez renseigner le message.'),
};

export const contactRequestsForm = {
    submitLine: {
        activeInput: true,
        activeLabel: 'Demande de contact active ?',
    },
    api: {
        dataFields: {
            active: { type: 'boolean' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            subject: { type: 'string' },
            message: { type: 'string' },
        },
    },
    fields: [
        {
            type: 'tabs',
            keyId: 'contactRequest',
            label: 'Demande de contact',
            fields: [
                {
                    type: 'block',
                    title: 'Informations générales',
                    keyId: 'block-general-info',
                    fields: [
                        {
                            keyId: 'input-firstName',
                            style: { xs: 12, sm: 6, md: 4, lg: 3 },
                            input: {
                                name: 'firstName',
                                label: 'Prénom',
                                inputType: 'textField',
                            },
                        },
                        {
                            keyId: 'input-lastName',
                            style: { xs: 12, sm: 6, md: 4, lg: 3 },
                            input: {
                                name: 'lastName',
                                label: 'Nom',
                                inputType: 'textField',
                            },
                        },
                        {
                            keyId: 'input-email',
                            style: { xs: 12, sm: 6, md: 4, lg: 3 },
                            input: {
                                name: 'email',
                                label: 'Email',
                                inputType: 'textField',
                                required: true,
                            },
                        },
                        {
                            keyId: 'input-phone',
                            style: { xs: 12, sm: 6, md: 4, lg: 3 },
                            input: {
                                name: 'phone',
                                label: 'Numéro de téléphone',
                                inputType: 'textField',
                            },
                        },

                        {
                            keyId: 'input-subject',
                            style: { xs: 12 },
                            input: {
                                name: 'subject',
                                label: 'Objet',
                                inputType: 'textField',
                            },
                        },
                        {
                            keyId: 'input-message',
                            style: { xs: 12 },
                            input: {
                                name: 'message',
                                label: 'Message',
                                inputType: 'textField',
                                required: true,
                                rows: 5,
                                multiline: true,
                            },
                        },
                    ],
                },
            ],
        },
    ],
    ...DEFAULT_CRUD_FORM_COMPONENTS,
};
