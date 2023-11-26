import * as Yup from 'yup';
import { Constant } from '@/AdminService/Constant';
import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';

export const createUsersInitialSchema = {
    firstName: '',
    lastName: '',
    email: '',
    roles: '',
    plainPassword: '',
    confirmPassword: '',
    active: false,
};

export const createUsersValidationSchema = {
    firstName: Yup.string().required('Veuillez renseigner le prénom.'),
    lastName: Yup.string().required('Veuillez renseigner le nom.'),
    email: Yup.string().email('Email invalide.').required("Veuillez renseigner l'adresse email."),
    plainPassword: Yup.string()
        .min(10, 'Votre mot de passe doit contenir au moins 10 caractères.')
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{9,}$/,
            'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spéciale.'
        )
        .required('Veuillez renseigner un mot de passe.'),
    confirmPassword: Yup.string().when('plainPassword', (plainPassword) => {
        if (plainPassword) {
            return Yup.string()
                .oneOf([Yup.ref('plainPassword')], 'Le mot de passe ne correspond pas.')
                .required('Veuillez confirmer le mot de passe.');
        }
    }),
    roles: Yup.string().required('Veuillez renseigner le rôle de cet utilisateur.'),
};

export const createUsersForm = {
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
            plainPassword: { type: 'string' },
            roles: { type: 'string' },
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
                            keyId: 'input-roles',
                            style: { xs: 12, sm: 6 },
                            input: {
                                name: 'roles',
                                label: 'Rôles',
                                inputType: 'selectField',
                                inputList: Constant.USER_ROLES,
                                listName: 'inputList',
                                getName: (item) => item.label,
                                getValue: (item) => item.value,
                                required: true,
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
                                required: true,
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
