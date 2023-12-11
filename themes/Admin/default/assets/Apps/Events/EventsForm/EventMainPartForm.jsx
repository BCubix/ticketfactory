import React from 'react';

import { Component } from '@/AdminService/Component';
import { SeoInitialFormInputs } from '@Apps/SEO/Form/SEOForm';
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
                {
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
                },
                {
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
                },
            ],
        },
        {
            type: 'block',
            keyId: 'block-annexe-info',
            title: 'Informations annexes',
            fields: [
                {
                    keyId: 'input-third-party-ticketing',
                    style: {
                        xs: 12,
                        sm: 6,
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                    },
                    input: {
                        name: 'useThirdPartyTicketing',
                        label: 'Utiliser une billetterie externe ?',
                        inputType: 'switch',
                        labelPlacement: 'start',
                    },
                },
                {
                    keyId: 'input-ticketing',
                    style: {
                        xs: 12,
                        sm: 6,
                    },
                    input: (props) =>
                        props.values.useThirdPartyTicketing
                            ? {
                                  name: 'thirdPartyTicketingUrl',
                                  label: 'Url de billetterie externe',
                                  inputType: 'textField',
                                  type: 'url',
                              }
                            : {
                                  name: 'ticketingId',
                                  label: 'Identifiant billetterie',
                                  inputType: 'textField',
                                  type: 'number',
                              },
                },
                {
                    keyId: 'input-event-length',
                    style: {
                        xs: 12,
                        sm: 6,
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
        SeoInitialFormInputs,
    ],
};
