import React from 'react';
import * as Yup from 'yup';
import { FormHelperText } from '@mui/material';

import { Component } from '@/AdminService/Component';
import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';
import { CONTENT_TYPE_FIELDS } from '@Apps/ContentTypes/services/config/getContentTypeFields';

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

export const pageTypesInitialSchema = {
    name: (initValues) => initValues?.name || '',
    active: (initValues) => initValues?.active || false,
    fields: (initValues) => initValues?.fields || [],
    maxObjectNb: (initValues) => initValues?.maxObjectNb || '',
    pageType: (initValues) => initValues?.pageType || true,
    displayBlocks: (initValues) => initValues?.displayBlocks || false,
};

export const pageTypesValidationSchema = {
    name: Yup.string().required('Veuillez renseigner le nom du type de page.'),
    fields: ({ getContentTypesModules }) =>
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

                        if (getContentTypesModules[type]?.getValidation) {
                            return Yup.object().shape({
                                ...getContentTypesModules[type].getValidation(),
                            });
                        }

                        return Yup.object().nullable();
                    }),
                })
            )
            .required('Veuillez renseigner un champ')
            .min(1, 'Veuillez renseigner au moins un type de champs'),
};

export const pageTypesForm = {
    submitLine: {
        activeInput: true,
        activeLabel: 'Type de page active ?',
    },
    api: {
        dataFields: {
            active: { type: 'boolean' },
            name: { type: 'string' },
            pageType: { type: 'boolean' },
            displayBlocks: { type: 'boolean' },
            maxObjectNb: { type: 'string' },
            keyword: { type: 'string' },
            pageParent: { type: 'string' },
            fields: {
                function: ({ values, formData }) => {
                    values.fields?.forEach((el, index) => {
                        serializeData(el, `fields[${index}]`, formData);
                    });
                },
            },
        },
    },
    contentTypeFields: CONTENT_TYPE_FIELDS,
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
                            keyId: 'input-name',
                            style: { xs: 12, sm: 6, md: 4 },
                            input: {
                                name: 'name',
                                label: 'Nom',
                                inputType: 'textField',
                                required: true,
                            },
                        },
                        {
                            keyId: 'input-maxObjectNb',
                            style: { xs: 12, sm: 6, md: 4 },
                            input: {
                                name: 'maxObjectNb',
                                label: "Nombre maximum d'objet",
                                inputType: 'textField',
                                type: 'number',
                            },
                        },
                        {
                            keyId: 'input-displayBlocks',
                            style: { xs: 12, sm: 6, md: 4, sx: { display: 'flex', alignItems: 'center' } },
                            input: {
                                name: 'displayBlocks',
                                label: 'Afficher les blocs classiques sur les pages',
                                inputType: 'checkbox',
                                labelPlacement: 'end',
                            },
                        },
                    ],
                },

                {
                    type: 'block',
                    title: 'Informations générales',
                    keyId: 'block-general-info',
                    fields: [
                        {
                            keyId: 'input-fields',
                            style: { xs: 12 },
                            component: ({ getContentTypesModules, values, errors, touched, handleChange, handleBlur, setFieldValue, setFieldTouched }) => (
                                <>
                                    <Component.ContentTypeFieldArrayForm
                                        contentTypesModules={getContentTypesModules}
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
