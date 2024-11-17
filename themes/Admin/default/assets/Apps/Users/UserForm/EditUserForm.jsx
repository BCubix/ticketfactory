import * as Yup from 'yup';
import { Constant } from '@/AdminService/Constant';
import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';

export const editUsersInitialSchema = {
    firstName: (initValues) => initValues?.firstName || '',
    lastName: (initValues) => initValues?.lastName || '',
    email: (initValues) => initValues?.email || '',
    profiles: (initValues) => initValues?.profiles?.map((profile) => profile.id) || [],
    plainPassword: '',
    confirmPassword: '',
    active: (initValues) => initValues?.active || false,
};

export const editUsersValidationSchema = {
    firstName: Yup.string().required('Veuillez renseigner le prénom.'),
    lastName: Yup.string().required('Veuillez renseigner le nom.'),
    email: Yup.string().email('Email invalide.').required("Veuillez renseigner l'adresse email."),
    plainPassword: Yup.string()
        .nullable()
        .min(10, 'Votre mot de passe doit contenir au moins 10 caractères.')
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{9,}$/,
            'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spéciale.'
        ),
    confirmPassword: Yup.string().when('plainPassword', (plainPassword) => {
        if (plainPassword) {
            return Yup.string()
                .oneOf([Yup.ref('plainPassword')], 'Le mot de passe ne correspond pas.')
                .required('Veuillez confirmer le mot de passe.');
        }
    }),
    profiles: Yup.array().required('Veuillez renseigner au moins un profil pour cet utilisateur.'),
};

export const editUsersForm = {
    submitLine: {
        activeInput: true,
        activeLabel: 'Utilisateur actif ?',
    },
    api: {
        dataFields: {
            active: { type: 'boolean' },
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            plainPassword: {
                function: ({ values, formData }) => {
                    if (values?.plainPassword) {
                        formData.append('plainPassword', values.plainPassword);
                    }
                },
            },
            profiles: {
                function: ({ values, formData }) => {
                    values.profiles.forEach((profile, index) => {
                        formData.append(`profiles[${index}]`, profile);
                    });
                },
            },
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
                            keyId: 'input-email',
                            style: { xs: 12, sm: 6 },
                            input: {
                                name: 'email',
                                label: 'Email',
                                inputType: 'textField',
                                required: true,
                            },
                        },
                        {
                            keyId: 'input-profiles',
                            style: { xs: 12, sm: 6 },
                            input: {
                                name: 'profiles',
                                label: 'Profils',
                                inputType: 'selectField',
                                listName: 'profilesList',
                                getName: (item) => item.name,
                                getValue: (item) => item.id,
                                required: true,
                                multiple: true,
                            },
                        },
                        {
                            keyId: 'input-firstName',
                            style: { xs: 12, sm: 6 },
                            input: {
                                name: 'firstName',
                                label: 'Prénom',
                                inputType: 'textField',
                                required: true,
                            },
                        },
                        {
                            keyId: 'input-lastName',
                            style: { xs: 12, sm: 6 },
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
