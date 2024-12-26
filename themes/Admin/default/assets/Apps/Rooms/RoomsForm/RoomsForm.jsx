import React from 'react';
import * as Yup from 'yup';

import { changeSlug } from '@Services/utils/changeSlug';
import { SeoInitialValues, SeoInitialFormInputs, SeoApiDataFields } from '@Apps/SEO/Form/SEOForm';
import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';

import { eventsPriceFormFields } from './../../Events/EventsForm/EventsPriceForm';
import { Component } from '@/AdminService/Component';

export const roomsInitialSchema = {
    name: (initValues) => initValues?.name || '',
    active: (initValues) => initValues?.active || false,
    seatsNb: (initValues) => initValues?.seatsNb || '',
    area: (initValues) => initValues?.area || '',
    seatingPlans: (initValues, { defaultPriceCategoryName, defaultPrices }) => (initValues?.seatingPlans ? 
        initValues?.seatingPlans?.map((el) => 
            ({ ...el,
            eventPriceCategories:  [{ name: defaultPriceCategoryName || 'Tarifs', 
                eventPrices: defaultPrices || [],
                 lang: initValues?.lang?.id || '' }],
            lang: el?.lang?.id || '' }))
        : []),
    slug: (initValues) => initValues?.slug || '',
    editSlug: false,
    lang: (initValues) => initValues?.lang?.id || '',
    languageGroup: (initValues) => initValues?.languageGroup || '',
    seo: SeoInitialValues,
};

export const roomsValidationSchema = {
    name: Yup.string().required('Veuillez renseigner le nom de la salle.').max(250, 'Le nom renseigné est trop long.'),
    seatingPlans: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required('Veuillez renseigner le nom du plan'),
        }),
        Yup.array().of(
            Yup.object().shape({
                name: Yup.string().required('Veuillez renseigner le nom du bloc.').max(250, 'Le nom du bloc est trop long'),
                eventPrices: Yup.array()
                    .of(
                        Yup.object().shape({
                            name: Yup.string().required('Veuillez renseigner le nom du tarif.'),
                            price: Yup.number().required('Veuillez renseigner le prix').min(0, 'Veuillez renseigner un prix valide.'),
                        })
                    )
                    .min(1, 'Veuillez renseigner au moins un prix.'),
            })
        ),
    ),
};

export const roomsForm = {
    submitLine: {
        activeInput: true,
        activeLabel: 'Salle active ?',
    },
    api: {
        dataFields: {
            active: { type: 'boolean' },
            name: { type: 'string' },
            area: { type: 'string' },
            seatsNb: { type: 'string' },
            slug: { type: 'slug' },
            lang: { type: 'string' },
            languageGroup: { type: 'string' },
            seatingPlans: {
                type: 'array',
                subFields: {
                    name: { type: 'string' },
                    lang: { type: 'string' },
                    languageGroup: { type: 'string' },
                    eventPriceCategories: {
                        type: 'array',
                        subFields: {
                            name: { type: 'string' },
                            lang: { type: 'string' },
                            languageGroup: { type: 'string' },
                            eventPrices: {
                                type: 'array',
                                subFields: {
                                    name: { type: 'string' },
                                    annotation: { type: 'string' },
                                    price: { type: 'string' },
                                    lang: { type: 'string' },
                                    languageGroup: { type: 'string' },
                                },
                            },
                        },
                    },
                },
            },
            seo: SeoApiDataFields,
        },
    },
    fields: [
        {
            type: 'tabs',
            keyId: 'room',
            label: 'Salle',
            fields: [
                {
                    type: 'block',
                    title: 'Informations générales',
                    keyId: 'block-general-info',
                    fields: [
                        {
                            keyId: 'input-name',
                            style: { xs: 12, sm: 6, md: 4 },
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
                            keyId: 'input-seatsNb',
                            style: { xs: 12, sm: 6, md: 4 },
                            input: {
                                name: 'seatsNb',
                                label: 'Nombre de places',
                                inputType: 'textField',
                                type: 'number',
                                sx: { marginBottom: 6 },
                            },
                        },
                        {
                            keyId: 'input-area',
                            style: { xs: 12, sm: 6, md: 4 },
                            input: {
                                name: 'area',
                                label: 'Superficie',
                                inputType: 'textField',
                                type: 'number',
                                sx: { marginBottom: 6 },
                            },
                        },
                    ],
                },
                SeoInitialFormInputs,
            ],
        },
        {
            type: 'tabs',
            keyId: 'seatingPlan',
            label: 'Plans',
            fields: [
                {
                    type: 'block',
                    title: 'Plans',
                    keyId: 'block-seating-plans',
                    fields: [
                        {
                            keyId: 'input-seating-plans',
                            style: { xs: 12 },
                            input: {
                                name: 'seatingPlans',
                                label: 'Plans',
                                inputType: 'fieldArray',
                                newObject: { name: '', eventPriceCategories: []},
                                fields: [
                                    {
                                        keyId: 'input-name',
                                        style: {
                                            xs: 12,
                                        },
                                        input: {
                                            name: 'name',
                                            label: 'Nom',
                                            inputType: 'textField',
                                            required: true,
                                            sx: { marginBottom: 6 },
                                        },
                                    },
                                    {
                                        keyId: 'prices',
                                        label: 'Tarifs',
                                        component: (props) => {
                                            const index = props.index;
                                            return (
                                              <Component.EventsPriceCategoryForm
                                                {...props}
                                                dataPath={`seatingPlans.${index}.eventPriceCategories`}
                                              />
                                            );
                                          },
                                        fields: eventsPriceFormFields.fields,
                                    }
                                ],
                            },
                           
                        },
                    ],
                },
            ]
            
        },
    ],
    ...DEFAULT_CRUD_FORM_COMPONENTS,
};
