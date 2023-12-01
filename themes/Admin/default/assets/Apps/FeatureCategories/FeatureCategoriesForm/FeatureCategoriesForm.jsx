import React from 'react';
import * as Yup from 'yup';

import { Component } from '@/AdminService/Component';
import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';
import { changeSlug } from '@Services/utils/changeSlug';

export const featureCategoriesInitialSchema = {
    name: (initValues) => initValues?.name || '',
    active: (initValues) => initValues?.active || false,
    slug: (initValues) => initValues?.slug || '',
    keyword: (initValues) => initValues?.seatsNb || '',
    lang: (initValues) => initValues?.lang?.id || '',
    languageGroup: (initValues) => initValues?.languageGroup || '',
    editSlug: false,
};

export const featureCategoriesValidationSchema = {
    name: Yup.string().required('Veuillez renseigner le nom de la salle.').max(250, 'Le nom renseigné est trop long.'),
};

export const featureCategoriesForm = {
    submitLine: {
        activeInput: true,
        activeLabel: 'Catégorie active ?',
    },
    api: {
        dataFields: {
            active: { type: 'boolean' },
            name: { type: 'string' },
            keyword: { type: 'string' },
            slug: { type: 'slug' },
            lang: { type: 'string' },
            languageGroup: { type: 'string' },
        },
    },
    fields: [
        {
            type: 'tabs',
            keyId: 'featureCategory',
            label: 'Catégorie',
            fields: [
                {
                    type: 'block',
                    title: 'Informations générales',
                    keyId: 'block-general-info',
                    fields: [
                        {
                            keyId: 'input-name',
                            style: { xs: 12, sm: 6, md: 8 },
                            inputs: [
                                {
                                    name: 'name',
                                    label: 'Nom',
                                    inputType: 'textField',
                                    required: true,
                                    custom: {
                                        handleChange:
                                            ({ values, initialValues, setFieldValue }) =>
                                            (e) => {
                                                setFieldValue('name', e.target.value);
                                                if (!values.editSlug && !initialValues) {
                                                    setFieldValue('slug', changeSlug(e.target.value));
                                                }
                                            },
                                    },
                                },
                                {
                                    name: 'slug',
                                    inputType: 'slugInput',
                                },
                            ],
                        },
                        {
                            keyId: 'input-keyword',
                            style: { xs: 12, sm: 6, md: 4 },
                            component: (props) => <Component.CmtKeywordInput {...props} name="keyword" />,
                        },
                    ],
                },
            ],
        },
    ],
    ...DEFAULT_CRUD_FORM_COMPONENTS,
};
