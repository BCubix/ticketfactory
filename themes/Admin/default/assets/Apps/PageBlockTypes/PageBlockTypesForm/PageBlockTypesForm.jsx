import React from 'react';
import * as Yup from 'yup';
import { FormHelperText } from '@mui/material';

import { Component } from '@/AdminService/Component';
import { CONTENT_TYPE_FIELDS } from '@Apps/ContentTypes/services/config/getContentTypeFields';
import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';

const serializeData = (element, name, formData) => {
    Object.entries(element).map(([key, value]) => {
        if (null !== value && typeof value === 'object') {
            serializeData(value, `${name}[${key}]`, formData);
        } else if (null !== value && Array.isArray(value)) {
            value.forEach((el, index) => {
                serializeData(el, `${name}[${key}][${index}]`, formData);
            });
        } else {
            formData.append(`${name}[${key}]`, value);
        }
    });
};

export const pageBlockTypesInitialSchema = {
    name: (initValues) => initValues?.name || '',
    active: (initValues) => initValues?.active || false,
    fields: (initValues) => initValues?.fields || [],
    keyword: (initValues) => initValues?.keyword || '',
};

export const pageBlockTypesValidationSchema = {
    name: Yup.string().required('Veuillez renseigner le nom du type de contenus.'),
    fields: ({ getPageBlockTypesModules }) =>
        Yup.array()
            .of(
                Yup.object().shape({
                    title: Yup.string().required('Veuillez renseigner le titre de votre champ.'),
                    name: Yup.string().required('Veuillez renseigner le nom de votre champ.'),
                    type: Yup.string().required('Veuillez renseigner le type de votre champ.'),
                    parameters: Yup.object().when('type', (type) => {
                        if (!type) {
                            return Yup.object().nullable();
                        }

                        if (getPageBlockTypesModules[type]?.getValidation) {
                            return Yup.object().shape({
                                ...getPageBlockTypesModules[type].getValidation(),
                            });
                        }

                        return Yup.object().nullable();
                    }),
                })
            )
            .required('Veuillez renseigner un champ')
            .min(1, 'Veuillez renseigner au moins un type de champs'),
};

export const pageBlockTypesForm = {
    submitLine: {
        activeInput: true,
        activeLabel: 'Type de contenus active ?',
    },
    api: {
        dataFields: {
            active: { type: 'boolean' },
            name: { type: 'string' },
            keyword: { type: 'string' },
            fields: {
                function: ({ values, formData }) => {
                    values.fields?.forEach((el, index) => {
                        serializeData(el, `fields[${index}]`, formData);
                    });
                },
            },
        },
    },
    pageBlockTypeFields: CONTENT_TYPE_FIELDS,
    fields: [
        {
            type: 'tabs',
            keyId: 'pageBlockType',
            label: 'Type de bloc',
            fields: [
                {
                    type: 'block',
                    title: 'Informations générales',
                    keyId: 'block-general-info',
                    fields: [
                        {
                            keyId: 'input-name',
                            style: { xs: 12, sm: 6 },
                            input: {
                                name: 'name',
                                label: 'Nom',
                                inputType: 'textField',
                                required: true,
                            },
                        },
                        {
                            keyId: 'input-keyword',
                            style: { xs: 12, sm: 6 },
                            component: (props) => <Component.CmtKeywordInput {...props} name="keyword" />,
                        },
                    ],
                },

                {
                    type: 'block',
                    title: 'Champs',
                    keyId: 'block-fields',
                    fields: [
                        {
                            keyId: 'input-fields',
                            style: { xs: 12 },
                            component: ({ getPageBlockTypesModules, values, errors, touched, handleChange, handleBlur, setFieldValue, setFieldTouched }) => (
                                <>
                                    <Component.ContentTypeFieldArrayForm
                                        contentTypesModules={getPageBlockTypesModules}
                                        values={values}
                                        errors={errors}
                                        touched={touched}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        setFieldValue={setFieldValue}
                                        setFieldTouched={setFieldTouched}
                                    />

                                    {errors?.fields && typeof errors?.fields === 'string' && (
                                        <FormHelperText error id="fields-helper-text">
                                            {errors.fields}
                                        </FormHelperText>
                                    )}
                                </>
                            ),
                        },
                    ],
                },
            ],
        },
    ],
    ...DEFAULT_CRUD_FORM_COMPONENTS,
};
