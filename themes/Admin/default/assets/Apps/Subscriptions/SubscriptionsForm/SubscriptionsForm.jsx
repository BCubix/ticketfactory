import * as Yup from 'yup';
import moment from 'moment/moment';

import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';

export const subscriptionsInitialSchema = {
    name: (initValues) => initValues?.name || '',
    description: (initValues) => initValues?.description || '',
    active: (initValues) => initValues?.active || false,
    eventNb: (initValues) => initValues?.eventNb || 1,
    price: (initValues) => initValues?.price || 0,
    beginDate: (initValues) => initValues?.beginDate || '',
    endDate: (initValues) => initValues?.endDate || '',
    duration: (initValues) => initValues?.duration || 1,
    events: (initValues) => initValues?.events?.map((item) => item.id) || [],
    media: (initValues) => initValues?.media || '',
    lang: (initValues) => initValues?.lang?.id || '',
    languageGroup: (initValues) => initValues?.languageGroup || '',
};

export const subscriptionsValidationSchema = {
    name: Yup.string().required("Veuillez renseigner le nom de l'abonnement.").max(250, 'Le nom renseigné est trop long.'),
    price: Yup.number().required('Veuillez renseigner le prix.').min(0, 'Veuillez renseigner un prix valide.'),
    eventNb: Yup.number().required("Veuillez renseigner le nombre d'événements.").min(1, 'Veuillez renseigner un nombre valide.'),
    duration: Yup.number().required('Veuillez renseigner la durée.').min(1, 'Veuillez renseigner une durée valide.'),
};

export const subscriptionsForm = {
    submitLine: {
        activeInput: true,
        activeLabel: 'abonnement actif ?',
    },
    api: {
        dataFields: {
            active: { type: 'boolean' },
            name: { type: 'string' },
            description: { type: 'string' },
            eventNb: { type: 'string' },
            price: { type: 'string' },
            duration: { type: 'string' },
            media: { type: 'id' },
            events: {
                function: ({ values, formData }) => {
                    values?.events?.forEach((events, index) => {
                        formData.append(`events[${index}]`, events);
                    });
                },
            },
            beginDate: {
                function: ({ values, formData }) => {
                    formData.append('beginDate', values.beginDate ? moment(values.beginDate).format('YYYY-MM-DD') : '');
                },
            },
            endDate: {
                function: ({ values, formData }) => {
                    formData.append('endDate', values.endDate ? moment(values.endDate).format('YYYY-MM-DD') : '');
                },
            },
            lang: { type: 'string' },
            languageGroup: { type: 'string' },
        },
    },
    fields: [
        {
            type: 'tabs',
            keyId: 'subscription',
            label: 'Abonnement',
            fields: [
                {
                    type: 'block',
                    title: 'Informations générales',
                    keyId: 'block-general-info',
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
                        {
                            keyId: 'input-description',
                            style: { xs: 12 },
                            input: {
                                name: 'description',
                                label: 'Description',
                                inputType: 'editorField',
                                required: true,
                                id: 'description',
                            },
                        },
                        {
                            keyId: 'input-price',
                            style: { xs: 12, sm: 6 },
                            input: {
                                name: 'price',
                                label: 'Prix',
                                inputType: 'textField',
                                type: 'number',
                                required: true,
                            },
                        },
                        {
                            keyId: 'input-duration',
                            style: { xs: 12, sm: 6 },
                            input: {
                                name: 'duration',
                                label: "Durée de l'abonnement (mois)",
                                inputType: 'textField',
                                type: 'number',
                                required: true,
                            },
                        },
                    ],
                },
                {
                    type: 'block',
                    title: 'Dates',
                    keyId: 'block-dates',
                    fields: [
                        {
                            keyId: 'input-beginDate',
                            style: { xs: 12, sm: 6 },
                            input: {
                                name: 'beginDate',
                                label: 'Date de début',
                                inputType: 'date',
                            },
                        },
                        {
                            keyId: 'input-endDate',
                            style: { xs: 12, sm: 6 },
                            input: {
                                name: 'endDate',
                                label: 'Date de fin',
                                inputType: 'date',
                            },
                        },
                    ],
                },
                {
                    type: 'block',
                    title: 'Evénements',
                    keyId: 'block-events',
                    fields: [
                        {
                            keyId: 'input-eventNb',
                            style: { xs: 12, sm: 3, lg: 1 },
                            input: {
                                name: 'eventNb',
                                label: "Nombre d'événements",
                                inputType: 'textField',
                                type: 'number',
                            },
                        },
                        {
                            keyId: 'input-events',
                            style: { xs: 12, sm: 9, lg: 11 },
                            input: {
                                name: 'events',
                                label: 'Evénements',
                                inputType: 'selectField',
                                listName: 'eventsList',
                                getName: (item) => item?.name,
                                getValue: (item) => item?.id,
                                required: true,
                                multiple: true,
                            },
                        },
                    ],
                },
                {
                    type: 'block',
                    title: 'Média',
                    keyId: 'block-media',
                    fields: [
                        {
                            keyId: 'input-media',
                            style: { xs: 12, sm: 3, lg: 3 },
                            input: {
                                name: 'media',
                                label: 'Image',
                                inputType: 'cmtImage',
                            },
                        },
                    ],
                },
            ],
        },
    ],
    ...DEFAULT_CRUD_FORM_COMPONENTS,
};
