import React, { useState } from 'react';
import * as Yup from 'yup';
import { Component } from '@/AdminService/Component';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Box } from '@mui/system';
import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';

export const pageBlocksInitialSchema = {
    name: (initValues) => initValues?.name || '',
    columns: (initValues) =>
        initValues?.columns?.map((element) => ({
            content: element?.content || '',
            xs: element?.xs || 12,
            s: element?.s || 12,
            m: element?.m || 12,
            l: element?.l || 12,
            xl: element?.xl || 12,
        })) || [],
    saveAsModel: 1,
    lang: (initValues) => initValues?.lang?.id || '',
    languageGroup: (initValues) => initValues?.languageGroup || '',
};

export const pageBlocksValidationSchema = {
    name: Yup.string().required('Veuillez renseigner le nom de votre bloc.').max(250, 'Le nom renseigné est trop long.'),
};

export const pageBlocksForm = {
    submitLine: {
        activeInput: false,
    },
    api: {
        dataFields: {
            name: { type: 'string' },
            saveAsModel: { type: 'boolean' },
            lang: { type: 'string' },
            languageGroup: { type: 'string' },
            blockType: { type: 'boolean' },
            columns: {
                type: 'array',
                subFields: {
                    content: { type: 'string' },
                    xs: { type: 'string' },
                    s: { type: 'string' },
                    m: { type: 'string' },
                    l: { type: 'string' },
                    xl: { type: 'string' },
                },
            },
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
                            style: { xs: 12 },
                            input: {
                                name: 'name',
                                label: 'Nom du bloc',
                                inputType: 'textField',
                                required: true,
                                sx: { marginBottom: 6 },
                            },
                        },
                        {
                            keyId: 'input-class',
                            style: { xs: 12 },
                            input: {
                                name: 'class',
                                label: 'Classe du bloc',
                                inputType: 'textField',
                                required: false,
                                sx: { marginBottom: 6 },
                            },
                        },
                    ],
                },
                {
                    type: 'block',
                    title: 'Contenu',
                    keyId: 'block-seating-plans',
                    fields: [
                        {
                            keyId: 'input-blocks',
                            style: { xs: 12 },
                            component: ({ setView, view, values, setFieldValue, setFieldTouched }) => (
                                <Box sx={{ paddingLeft: 5 }} minHeight={200}>
                                    <ToggleButtonGroup
                                        orientation="vertical"
                                        value={view}
                                        exclusive
                                        onChange={(e, newValue) => {
                                            setView(newValue);
                                        }}
                                        size="small"
                                        sx={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 0 }}
                                    >
                                        <ToggleButton value="xs" aria-label="XS">
                                            XS
                                        </ToggleButton>

                                        <ToggleButton value="s" aria-label="S">
                                            S
                                        </ToggleButton>

                                        <ToggleButton value="m" aria-label="M">
                                            M
                                        </ToggleButton>

                                        <ToggleButton value="l" aria-label="L">
                                            L
                                        </ToggleButton>

                                        <ToggleButton value="xl" aria-label="XL">
                                            XL
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                    <Component.PageBlockColumnPart values={values} media={view} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                                </Box>
                            ),
                        },
                    ],
                },
            ],
        },
    ],
    ...DEFAULT_CRUD_FORM_COMPONENTS,
};

export const PageBlocksForm = ({ handleSubmit, initialValues = null, modelValues = null, translateInitialValues = null, formCrud, ...props }) => {
    const [view, setView] = useState('xl');
    const initValues = translateInitialValues || initialValues || modelValues;

    return (
        <Component.CmtCrudForm
            {...{ createMode: !Boolean(initialValues), handleSubmit, view, setView, initialValues: initValues, modelValues, translateInitialValues, formCrud, ...props }}
        />
    );
};
