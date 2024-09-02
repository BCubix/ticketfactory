import React from 'react';

import { Component } from '@/AdminService/Component';
import { IndexSeoInitialFormInputs } from '@Apps/SEO/Form/SEOForm';
import { changeSlug } from '@Services/utils/changeSlug';

export const eventMainPartForm = {
    blocks: [
        {
            type: 'block',
            keyId: 'block-general-info',
            title: 'Informations générales',
            fields: [
                {
                    keyId: 'input-name',
                    style: {
                        xs: 12,
                    },
                    inputs: [
                        {
                            name: 'name',
                            label: 'Nom',
                            inputType: 'textField',
                            required: true,
                            sx: { marginBottom: 6 },
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
                    keyId: 'input-chapo',
                    style: {
                        xs: 12,
                    },
                    input: {
                        name: 'chapo',
                        label: 'Chapô',
                        inputType: 'textField',
                        required: true,
                        sx: { marginTop: 1 },
                        rows: 4,
                        multiline: true,
                    },
                },
                {
                    keyId: 'input-description',
                    style: {
                        xs: 12,
                    },
                    input: {
                        name: 'description',
                        label: 'Description',
                        inputType: 'editorField',
                        required: true,
                        id: 'description',
                    },
                },

                ({ roomsList }) => {
                    if (roomsList.length === 0) {
                        return null;
                    }

                    return {
                        keyId: 'input-room',
                        style: {
                            xs: 12,
                            sm: 6,
                        },
                        input: {
                            name: 'room',
                            label: 'Salle',
                            inputType: 'selectField',
                            listName: 'roomsList',
                            getName: (item) => item.name,
                            getValue: (item) => item.id,
                        },
                    };
                },

                ({ seasonsList }) => {
                    if (seasonsList.length === 0) {
                        return null;
                    }

                    return {
                        keyId: 'input-season',
                        style: {
                            xs: 12,
                            sm: 6,
                        },
                        input: {
                            name: 'season',
                            label: 'Saison',
                            inputType: 'selectField',
                            listName: 'seasonsList',
                            getName: (item) => item.name,
                            getValue: (item) => item.id,
                        },
                    };
                },

                ({ eventTypesList }) => {
                    if (eventTypesList.length === 0) {
                        return null;
                    }

                    return {
                        keyId: 'input-event-type',
                        style: {
                            xs: 12,
                            sm: 6,
                        },
                        input: {
                            name: 'eventType',
                            label: "Type d'évènement",
                            inputType: 'selectField',
                            listName: 'eventTypesList',
                            displayEmpty: false,
                            getName: (item) => item.name,
                            getValue: (item) => item.id,
                        },
                    };
                },
            ],
        },
        {
            type: 'block',
            keyId: 'block-annexe-info',
            title: 'Informations annexes',
            fields: [
                {
                    keyId: 'input-ticketing',
                    style: {
                        xs: 12,
                        sm: 4,
                    },
                    input: {
                        name: 'ticketing',
                        label: 'Billetterie',
                        inputType: 'selectField',
                        listName: 'ticketingList',
                        getName: (item) => item.name,
                        getValue: (item) => item.id,
                    },
                },
                {
                    keyId: 'input-ticketing',
                    style: {
                        xs: 12,
                        sm: 4,
                    },
                    component: (props) => (
                        <Component.CmtKeywordInput
                            label={props?.ticketingList?.find((it) => it?.id === props.values?.ticketing)?.module ? 'Identifiant billetterie' : 'Lien externe'}
                            {...props}
                            name="ticketingReference"
                            disabled={!Boolean(props.values?.ticketing)}
                            warningMessage="Ce champ est utilisé pour identifier votre évènement auprès de votre billetterie."
                            editName="ticketingReferenceEditMode"
                        />
                    ),
                },
                {
                    keyId: 'input-display-booking-button',
                    style: {
                        xs: 12,
                        sm: 4,
                    },
                    input: {
                        name: 'displayBookingButton',
                        label: 'Afficher le bouton de réservation ?',
                        inputType: 'switch',
                        sx: { marginTop: 5 },
                    },
                },
                {
                    keyId: 'input-event-length',
                    style: {
                        xs: 12,
                        sm: 4,
                    },
                    input: {
                        name: 'eventLength',
                        label: "Durée de l'évènement",
                        inputType: 'textField',
                    },
                },
            ],
        },
        {
            type: 'block',
            keyId: 'block-categories',
            title: 'Catégories',
            fields: [
                {
                    keyId: 'form-event-category',
                    style: { xs: 12, md: 6 },
                    component: (props) => <Component.EventParentCategoryPartForm {...props} />,
                },
                {
                    keyId: 'input-tags',
                    style: { xs: 12, md: 6 },
                    input: {
                        name: 'tags',
                        label: 'Tags',
                        inputType: 'selectField',
                        listName: 'tagsList',
                        multiple: true,
                        getName: (item) => item.name,
                        getValue: (item) => item.id,
                    },
                },
            ],
        },
        IndexSeoInitialFormInputs,
    ],
};
