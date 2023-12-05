import React from 'react';
import * as Yup from 'yup';

import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';
import { Component } from '@/AdminService/Component';
import { changeSlug } from '@Services/utils/changeSlug';

export const featuresInitialSchema = {
    name: (initValues) => initValues?.name || '',
    active: (initValues) => initValues?.active || false,
    slug: (initValues) => initValues?.slug || '',
    keyword: (initValues) => initValues?.keyword || '',
    type: (initValues) => initValues?.type || 'text',
    position: (initValues) => initValues?.position || '',
    filter: (initValues) => initValues?.filter || false,
    filterType: (initValues) => initValues?.filterType || '',
    featureCategory: (initValues) => initValues?.featureCategory?.id || '',
    featureValues: (initValues) => (initValues?.featureValues ? initValues?.featureValues?.map((el) => ({ ...el })) : []),
    editSlug: false,
    lang: (initValues) => initValues?.lang?.id || '',
    languageGroup: (initValues) => initValues?.languageGroup || '',
};

export const featuresValidationSchema = {
    name: Yup.string().required("Veuillez renseigner le nom de l'attribut.").max(250, 'Le nom renseigné est trop long.'),
    type: Yup.string().required("Veuillez renseigner le type de l'attribut."),
    position: Yup.number().required("Veuillez renseigner la position de l'attribut.").min(1, 'Veuillez renseigner une position valide'),
    featureCategory: Yup.string().required("Veuillez renseigner la catégorie de l'attribut."),
    filterType: Yup.string().when('filter', (filter) => {
        if (filter) {
            return Yup.string().required('Veuillez renseigner le type de filtre.');
        }
    }),
    featureValues: Yup.array().of(
        Yup.object().shape({
            value: Yup.string().required('Veuillez renseigner la valeur.'),
        })
    ),
};

export const featuresForm = {
    submitLine: {
        activeInput: true,
        activeLabel: 'Attribut active ?',
    },
    api: {
        dataFields: {
            active: { type: 'boolean' },
            name: { type: 'string' },
            slug: { type: 'string' },
            keyword: { type: 'string' },
            type: { type: 'string' },
            position: { type: 'string' },
            filter: { type: 'boolean' },
            filterType: {
                function: ({ values, formData }) => {
                    formData.append('filterType', values?.filter ? values?.filterType : '');
                },
            },
            featureCategory: { type: 'string' },
            featureValues: {
                type: 'array',
                subFields: {
                    value: { type: 'string' },
                    custom: { type: 'boolean' },
                },
            },
            lang: { type: 'string' },
            languageGroup: { type: 'string' },
        },
    },
    fields: [
        {
            type: 'tabs',
            keyId: 'feature',
            label: 'Attribut',
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
                            keyId: 'input-type',
                            style: { xs: 12, sm: 6, md: 8 },
                            input: {
                                name: 'type',
                                label: 'Type',
                                inputType: 'selectField',
                                required: true,
                                listType: [
                                    { label: 'Texte', value: 'text' },
                                    { label: 'Nombre', value: 'number' },
                                    { label: 'Date', value: 'date' },
                                    { label: 'Couleur', value: 'color' },
                                ],
                                listName: 'listType',
                                getValue: (item) => item.value,
                                getName: (item) => item.label,
                                custom: {
                                    setFieldValue:
                                        ({ setFieldValue, values }) =>
                                        (name, newValue) => {
                                            setFieldValue(name, newValue);

                                            if (values?.featureValues?.length === 0) {
                                                return;
                                            }

                                            for (let i = 0; i < values?.featureValues?.length; i++) {
                                                setFieldValue(`featureValues.${i}.value`, '');
                                            }
                                        },
                                },
                            },
                        },
                        {
                            keyId: 'input-position',
                            style: { xs: 12, sm: 6, md: 4 },
                            input: {
                                name: 'position',
                                label: 'Position',
                                inputType: 'textField',
                                type: 'number',
                                required: true,
                            },
                        },
                        {
                            keyId: 'input-featureCategory',
                            style: {
                                xs: 12,
                            },
                            input: {
                                name: 'featureCategory',
                                label: 'Catégorie',
                                inputType: 'selectField',
                                listName: 'featureCategoriesList',
                                getName: (item) => item.name,
                                getValue: (item) => item.id,
                                required: true,
                            },
                        },
                        {
                            keyId: 'input-filter',
                            style: { xs: 12, sm: 4, md: 2, sx: { display: 'flex', alignItems: 'center' } },
                            input: {
                                name: 'filter',
                                label: 'Filtrer avec cet Attribut ?',
                                inputType: 'switch',
                                sx: { marginTop: 11 },
                                custom: {
                                    handleChange:
                                        ({ setFieldValue }) =>
                                        (e) => {
                                            if (!e.target.checked) {
                                                setFieldValue('filterType', '');
                                            }
                                            setFieldValue('filter', e.target.checked);
                                        },
                                },
                            },
                        },
                        {
                            keyId: 'input-filterType',
                            style: { xs: 12, sm: 8, md: 10, sx: { marginTop: 6, display: 'flex', alignItems: 'center' } },
                            filterTypesList: {
                                text: [
                                    { label: 'Boutons radio', value: 'radio' },
                                    { label: 'Cases à cocher', value: 'checkbox' },
                                    { label: 'Liste déroulante', value: 'simple_list' },
                                    { label: 'Liste multiple', value: 'multiple_list' },
                                ],
                                number: [
                                    { label: 'Liste déroulante', value: 'simple_list' },
                                    { label: 'Liste multiple', value: 'multiple_list' },
                                    { label: 'Réglette', value: 'slider' },
                                    { label: 'Min-Max', value: 'minmax' },
                                ],
                                date: [
                                    { label: 'Liste déroulante', value: 'simple_list' },
                                    { label: 'Liste multiple', value: 'multiple_list' },
                                    { label: 'Réglette', value: 'slider' },
                                    { label: 'Min-Max', value: 'minmax' },
                                ],
                                color: [{ label: 'Couleur', value: 'color' }],
                            },
                            component: ({ listName, values, touched, errors, setFieldValue, filterTypesList, ...props }) => {
                                if (!values?.filter || !values?.type) {
                                    return <></>;
                                }

                                return (
                                    <Component.CmtSelectField
                                        {...props}
                                        label={'Type de filtre'}
                                        value={values?.filterType}
                                        errors={touched?.filterType && errors?.filterType}
                                        list={values?.type ? filterTypesList[values?.type] || [] : []}
                                        name={'filterType'}
                                        setFieldValue={setFieldValue}
                                        filterTypesList={filterTypesList}
                                        getValue={(item) => item.value}
                                        getName={(item) => item.label}
                                        required
                                    />
                                );
                            },
                        },
                    ],
                },
                {
                    type: 'block',
                    title: 'Valeurs',
                    keyId: 'block-featureValues',
                    fields: [
                        {
                            keyId: 'input-featureValues',
                            style: { xs: 12 },
                            input: {
                                name: 'featureValues',
                                label: 'Valeurs',
                                inputType: 'fieldArray',
                                newObject: { value: '', custom: false },
                                fields: [
                                    {
                                        keyId: 'input-value',
                                        style: {
                                            xs: 12,
                                        },

                                        component: (props) => <Component.CmtFeaturesTypeValues {...props} label="Valeur" name="value" />,
                                    },
                                ],
                            },
                        },
                    ],
                },
            ],
        },
    ],
    ...DEFAULT_CRUD_FORM_COMPONENTS,
};
