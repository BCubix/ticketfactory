import React from 'react';
import * as Yup from 'yup';

import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';
import { SeoInitialValues, SeoInitialFormInputs, SeoApiDataFields } from '@Apps/SEO/Form/SEOForm';

import { Component } from '@/AdminService/Component';

import { changeSlug } from '@Services/utils/changeSlug';

export const categoriesInitialSchema = {
    id: (initValues) => initValues?.id || undefined,
    name: (initValues) => initValues?.name || '',
    active: (initValues) => initValues?.active || false,
    parent: (initValues, { parentId }) => initValues?.parent?.id || parentId || '',
    mustHaveParent: (initValues) => !initValues || Boolean(initValues?.parent),
    
    slug: (initValues) => initValues?.slug || '',
    lang: (initValues) => initValues?.lang?.id || '',
    languageGroup: (initValues) => initValues?.languageGroup || '',
    keyword: (initValues) => initValues?.keyword || '',
    color: (initValues) => initValues?.color || '',
    editSlug: false,
    editKeyword: false,
    seo: SeoInitialValues,
};

export const categoriesValidationSchema = {
    name: Yup.string().required('Veuillez renseigner le nom de la categorie.'),
    color: Yup.string().required('Veuillez renseigner la couleur de la categorie.'),
    parent: Yup.string().when('mustHaveParent', (mustHaveParent) => {
        if (mustHaveParent) {
            return Yup.string().required('Veuillez renseigner une catégorie parente.');
        }
    }),
};

export const categoriesForm = {
    submitLine: {
        activeInput: true,
        activeLabel: 'Catégorie active ?',
    },
    api: {
        dataFields: {
            active: { type: 'boolean' },
            name: { type: 'string' },
            parent: { type: 'string' },
            slug: { type: 'string' },
            keyword: { type: 'string' },
            color: { type: 'string' },
            lang: { type: 'string' },
            languageGroup: { type: 'string' },
            seo: SeoApiDataFields,
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
                            keyId: 'input-color',
                            style: { xs: 12, sm: 6, md: 4 },
                            component: (props) => <Component.CmtColorPicker {...props} name="color" />,
                        },
                        {
                            keyId: 'input-parent',
                            style: { xs: 12 },
                            component: ({ values, categoriesList, setFieldValue, touched, errors }) => {
                                {
                                    if (!values?.mustHaveParent) {
                                        return <></>;
                                    }

                                    return (
                                        <Component.ParentCategoryPartForm
                                            values={values}
                                            categoriesList={categoriesList}
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
                SeoInitialFormInputs,
            ],
        },
    ],
    ...DEFAULT_CRUD_FORM_COMPONENTS,
};
