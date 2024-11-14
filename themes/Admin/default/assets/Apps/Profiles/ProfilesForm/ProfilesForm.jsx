import React from 'react';
import * as Yup from 'yup';

import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';

export const profilesInitialSchema = {
    name: (initValues) => initValues?.name || '',
    roles: (initValues) => initValues?.roles?.map((role) => role.id),
    active: (initValues) => initValues?.active || false,
};

export const profilesValidationSchema = {
    name: Yup.string().required('Veuillez renseigner le nom du profil.').max(250, 'Le nom du profil est trop long'),
};

export const profilesForm = {
    submitLine: {
        activeInput: true,
        activeLabel: 'Profil actif ?',
    },
    api: {
        dataFields: {
            active: { type: 'boolean' },
            name: { type: 'string' },
            roles: {
                function: ({ values, formData }) => {
                    values?.roles?.forEach((role, index) => {
                        formData.append(`roles[${index}]`, role);
                    });
                },
            },
        },
    },
    fields: [
        {
            type: 'tabs',
            keyId: 'profile',
            label: 'Profil',
            fields: [
                {
                    type: 'block',
                    keyId: 'block-general-info',
                    title: 'Informations générales',
                    fields: [
                        {
                            keyId: 'input-name',
                            style: { xs: 12 },
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
