import React from 'react';
import * as Yup from 'yup';

import { Component } from '@/AdminService/Component';
import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';
import { changeSlug } from '@Services/utils/changeSlug';

export const mediaCategoriesInitialSchema = {
    id: (initValues) => initValues?.id || undefined,
    name: (initValues) => initValues?.name || '',
    active: (initValues) => initValues?.active || false,
    shortDescription: (initValues) => initValues?.shortDescription || '',
    parent: (initValues, { parentId }) => initValues?.parent?.id || parentId || '',
    mustHaveParent: (initValues) => !initValues || Boolean(initValues?.parent),
    slug: (initValues) => initValues?.slug || '',
    lang: (initValues) => initValues?.lang?.id || '',
    languageGroup: (initValues) => initValues?.languageGroup || '',
    keyword: (initValues) => initValues?.keyword || '',
    editSlug: false,
    editKeyword: false,
};

export const mediaCategoriesValidationSchema = {
    name: Yup.string().required('Veuillez renseigner le nom de la categorie.'),
    parent: Yup.string().when('mustHaveParent', (mustHaveParent) => {
        if (mustHaveParent) {
            return Yup.string().required('Veuillez renseigner une catégorie parente.');
        }
    }),
};

export const mediaCategoriesForm = {
    submitLine: {
        activeInput: true,
        activeLabel: 'Catégorie active ?',
    },
    api: {
        dataFields: {
            active: { type: 'boolean' },
            name: { type: 'string' },
            shortDescription: { type: 'string' },
            parent: { type: 'string' },
            slug: { type: 'string' },
            keyword: { type: 'string' },
            lang: { type: 'string' },
            languageGroup: { type: 'string' },
        },
    },
    fields: [
        {
            type: 'tabs',
            keyId: 'category',
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
                        {
                            keyId: 'input-shortDescription',
                            style: { xs: 12 },
                            input: {
                                name: 'shortDescription',
                                label: 'Description courte',
                                inputType: 'textField',
                                required: false,
                            },
                        },
                        {
                            keyId: 'input-parent',
                            style: { xs: 12 },
                            component: ({ values, mediaCategoriesList, setFieldValue, touched, errors }) => {
                                {
                                    if (!values?.mustHaveParent) {
                                        return <></>;
                                    }

                                    return (
                                        <Component.ParentMediaCategoryPartForm
                                            values={values}
                                            mediaCategoriesList={mediaCategoriesList}
                                            setFieldValue={setFieldValue}
                                            touched={touched}
                                            errors={errors}
                                        />
                                    );
                                }
                            },
                        },
                    ],
                },
            ],
        },
    ],
    ...DEFAULT_CRUD_FORM_COMPONENTS,
};
