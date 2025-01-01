import React from 'react';
import moment from 'moment';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';

import { SeoApiDataFields, SeoInitialValues } from '@Apps/SEO/Form/SEOForm';
import { eventMainPartForm } from './EventMainPartForm';
import { eventFeaturesPartForm } from './EventFeaturesPartForm';
import { eventsPriceFormFields } from './EventsPriceForm';
import { eventsDateFormFields } from './EventsDateForm';

import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';

export const eventsValidationSchema = {
    name: Yup.string().required("Veuillez renseigner le nom de l'évènement.").max(250, "Le nom de l'évènement est trop long"),
    chapo: Yup.string().required('Veuillez renseigner le chapô.'),
    eventCategories: Yup.array().min(1, 'Veuillez renseigner au moins une catégorie.'),
    mainCategory: Yup.string().required('Veuillez renseigner la catégorie principale.'),
    description: Yup.string().required('Veuillez renseigner une description.'),
    eventDates: Yup.array()
        .of(
            Yup.object().shape({
                eventDate: Yup.string().required('Veuillez renseigner la date.'),
                state: Yup.string().required('Veuillez renseigner le status de cette date.'),
                reportDate: Yup.string().when('state', (state) => {
                    if (state === 'delayed') {
                        return Yup.string().required('Veuillez renseigner la nouvelle date.');
                    } else {
                        return Yup.string().nullable();
                    }
                }),
            })
        )
        .min(1, 'Veuillez renseigner au moins une date.'),
    eventPriceCategories: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required('Veuillez renseigner le nom du bloc.').max(250, 'Le nom du bloc est trop long'),
            eventPrices: Yup.array()
                .of(
                    Yup.object().shape({
                        name: Yup.string().required('Veuillez renseigner le nom du tarif.'),
                        price: Yup.number().required('Veuillez renseigner le prix').min(0, 'Veuillez renseigner un prix valide.'),
                        defaultPrice: Yup.boolean().required('Veuillez indiquer si ce tarif est le tarif par défaut.'),
                    })
                )
                .min(1, 'Veuillez renseigner au moins un prix.'),
        })
    ),
    featureLinks: Yup.array().of(
        Yup.object().shape({
            feature: Yup.string().required('Veuillez renseigner un attribut.'),
            featureValue: Yup.string().when('featureValueRaw', (featureValueRaw) => {
                if (!featureValueRaw) {
                    return Yup.string().required('Veuillez choisir une valeur ou renseigner une valeur personnalisée.');
                }
            }),
        })
    ),
};

export const eventsInitialSchema = {
    active: (initValues) => initValues?.active || false,
    name: (initValues) => initValues?.name || '',
    chapo: (initValues) => initValues?.chapo || '',
    description: (initValues) => initValues?.description || '',
    eventLength: (initValues) => initValues?.eventLength || '',
    eventDates: (initValues) => {
        return (
            initValues?.eventDates?.map((el, index) => ({
                ...el,
                eventDateUuid: uuidv4(),
                lang: el?.lang?.id || '',
                index: index,
            })) || [{ lang: initValues?.lang?.id || '' }]
        );
    },

    eventPriceCategories: (initValues, { defaultPriceCategoryName, defaultPrices }) =>
        initValues?.eventPriceCategories?.map((el, blockIndex) => ({
            ...el,
            lang: el?.lang?.id || '',
            eventPrices:
                el?.eventPrices?.map((price, index) => ({
                    ...price,
                    lang: price?.lang?.id || '',
                    index,
                })) || defaultPrices,
            index: blockIndex,
        })) || [{ name: defaultPriceCategoryName || 'Tarifs', eventPrices: defaultPrices || [], lang: initValues?.lang?.id || '' }],
    eventCategories: (initValues, { categoriesList }) => (initValues?.eventCategories ? initValues?.eventCategories?.map((el) => el.id) : [categoriesList?.id]),
    room: (initValues, { roomsList }) => initValues?.room?.id || (roomsList?.length === 1 ? roomsList[0]?.id : ''),
    seatingPlan: (initValues) => initValues?.seatingPlan?.id || '',
    season: (initValues, { seasonsList }) => initValues?.season?.id || (seasonsList?.length === 1 ? seasonsList[0]?.id : ''),
    eventType: (initValues, { eventTypesList }) => initValues?.eventType?.id || (eventTypesList?.length === 1 ? eventTypesList[0]?.id : ''),
    tags: (initValues) => (initValues?.tags ? initValues?.tags?.map((el) => el.id) : []),
    mainCategory: (initValues, { categoriesList }) => initValues?.mainCategory?.id || categoriesList?.id,
    multiplePriceCategory: (initValues) => initValues?.eventPriceCategories?.length > 1 || false,
    multipleDate: (initValues) => initValues?.eventDates?.length > 1 || false,
    eventMedias: (initValues) =>
        initValues?.eventMedias?.map((el) => ({
            position: el.position,
            id: el.media?.id,
            media: el.media,
        })) || [],
    slug: (initValues) => initValues?.slug || '',
    editSlug: false,
    lang: (initValues) => initValues?.lang?.id || '',
    languageGroup: (initValues) => initValues?.languageGroup || '',
    ticketing: (initValues, { ticketingList }) =>
        initValues?.ticketing?.id || initValues?.ticketing || (!initValues && ticketingList?.find((item) => item?.defaultTicketing)?.id) || '',
    ticketingReference: (initValues) => initValues?.ticketingReference || '',
    displayBookingButton: (initValues) => (initValues?.displayBookingButton || initValues?.displayBookingButton === false ? initValues?.displayBookingButton : true),
    featureLinks: (initValues) =>
        initValues?.featureLinks
            ? initValues?.featureLinks?.map((el) => ({
                  ...el,
                  event: el?.event?.id,
                  product: el?.product?.id,
                  feature: el?.feature?.id,
                  featureValue: el?.featureValue?.custom ? '' : el?.featureValue?.id,
                  featureValueRaw: el?.featureValue?.custom ? el?.featureValue?.value : '',
                  featureValueRawId: el?.featureValue?.custom ? el?.featureValue?.id : '',
              }))
            : [],
    seo: SeoInitialValues,
};

export const eventsForm = {
    submitLine: {
        activeInput: true,
        activeLabel: 'Evènement actif ?',
    },
    infos: {
        seoIndexedLabel: 'Indexer cet évènement ?',
    },
    api: {
        dataFields: {
            active: { type: 'boolean' },
            name: { type: 'string' },
            chapo: { type: 'string' },
            description: { type: 'string' },
            room: { type: 'string' },
            seatingPlan: { type: 'string' },
            eventType: { type: 'string' },
            season: { type: 'string' },
            mainCategory: { type: 'string' },
            slug: { type: 'slug' },
            lang: { type: 'string' },
            languageGroup: { type: 'string' },
            ticketing: { type: 'string' },
            ticketingReference: { type: 'string' },
            displayBookingButton: { type: 'boolean' },
            eventLength: { type: 'string' },
            eventDates: {
                type: 'array',
                subFields: {
                    eventDate: {
                        function: ({ values, formData, baseName }) => {
                            formData.append(`${baseName || ''}[eventDate]`, moment(values.eventDate).format('YYYY-MM-DD HH:mm'));
                        },
                    },
                    eventDateUuid: { type: 'string' },
                    annotation: { type: 'string' },
                    state: { type: 'string' },
                    lang: { type: 'string' },
                    languageGroup: { type: 'string' },
                    reportDate: {
                        function: ({ values, formData, baseName }) => {
                            if (values.reportDate) {
                                formData.append(`${baseName || ''}[reportDate]`, values.reportDate);
                            }
                        },
                    },
                },
            },
            eventPriceCategories: {
                type: 'array',
                subFields: {
                    name: { type: 'string' },
                    lang: { type: 'string' },
                    eventDateUuid: { type: 'string' },
                    languageGroup: { type: 'string' },
                    eventPrices: {
                        type: 'array',
                        subFields: {
                            name: { type: 'string' },
                            annotation: { type: 'string' },
                            price: { type: 'string' },
                            defaultPrice: { type: 'boolean' },
                            lang: { type: 'string' },
                            languageGroup: { type: 'string' },
                        },
                    },

                    eventDate: {
                        eventDate: {
                            function: ({ values, formData, baseName }) => {
                                formData.append(`${baseName || ''}[eventDate]`, moment(values.eventDate).format('YYYY-MM-DD HH:mm'));
                            },
                        },
                        annotation: { type: 'string' },
                        state: { type: 'string' },
                        lang: { type: 'string' },
                        languageGroup: { type: 'string' },
                        reportDate: {
                            function: ({ values, formData, baseName }) => {
                                if (values.reportDate) {
                                    formData.append(`${baseName || ''}[reportDate]`, values.reportDate);
                                }
                            },
                        },
                    },
                },
            },
            eventCategories: {
                function: ({ values, formData }) => {
                    values?.eventCategories?.forEach((category, index) => {
                        formData.append(`eventCategories[${index}]`, category);
                    });
                },
            },
            tags: {
                function: ({ values, formData }) => {
                    values?.tags?.forEach((tag, index) => {
                        formData.append(`tags[${index}]`, tag);
                    });
                },
            },
            eventMedias: {
                type: 'array',
                subFields: {
                    media: { function: ({ values, formData, baseName }) => formData.append(`${baseName}[media]`, values.id) },
                    position: { function: ({ values, formData, baseName, index }) => formData.append(`${baseName}[position]`, values.position || index + 1) },
                },
            },
            featureLinks: {
                type: 'array',
                subFields: {
                    feature: { type: 'string' },
                    featureValue: {
                        function: ({ values, formData, baseName }) => {
                            formData.append(`${baseName}[featureValue]`, values?.featureValue || values?.featureValueRawId || '');
                        },
                    },
                    featureValueRaw: { type: 'string' },
                },
            },
            seo: SeoApiDataFields,
        },
    },
    fields: [
        {
            type: 'tabs',
            keyId: 'events',
            label: 'Evènement',
            fields: eventMainPartForm.blocks,
        },
        {
            type: 'tabs',
            keyId: 'dates',
            label: 'Dates',
            component: (props) => <Component.EventsDateForm {...props} setFieldValue={props.setFieldValue} />,
            fields: eventsDateFormFields.fields,
        },
        {
            type: 'tabs',
            keyId: 'prices',
            label: 'Tarifs',
            component: (props) => <Component.EventsPriceCategoryForm {...props} />,
            fields: eventsPriceFormFields.fields,
        },
        {
            type: 'tabs',
            keyId: 'features',
            label: 'Attributs',
            fields: eventFeaturesPartForm.blocks,
        },
        {
            type: 'tabs',
            keyId: 'medias',
            label: 'Médias',
            component: (props) => <Component.EventMediaPartForm {...props} />,
        },
    ],
    actionButton: ({ initialValues, navigate }) => {
        return (
            initialValues && (
                <Component.ActionButton variant="contained" sx={{ marginLeft: 'auto' }} onClick={() => navigate(Constant.EVENT_HISTORY_BASE_PATH + `/${initialValues?.id}`)}>
                    Historique de l'événement
                </Component.ActionButton>
            )
        );
    },
    ...DEFAULT_CRUD_FORM_COMPONENTS,
};
