import React, { useMemo, useState } from 'react';
import * as Yup from 'yup';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';
import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';
import { PAGE_COLUMN_TYPE_FIELDS } from '@Apps/PageBlocks/services/config/getPageColumnTypeFields';
import { CONTENT_FIELDS } from '@Apps/Contents/services/config/getContentFields';

const serializeData = (element, name, formData) => {
    if (null !== element && typeof element !== 'object') {
        formData.append(name, element);

        return;
    }

    Object.entries(element).map(([key, value]) => {
        if (null !== value && typeof value === 'object') {
            serializeData(value, `${name}[${key}]`, formData);
        } else if (null !== value && Array.isArray(value)) {
            value.forEach((el, index) => {
                serializeData(el, `${name}[${key}][${index}]`, formData);
            });
        } else {
            formData.append(`${name}[${key}]`, value !== null ? value : '');
        }
    });
};

export const pageBlocksInitialSchema = {
    name: (initValues) => initValues?.name || '',
    columns: (initValues) =>
        initValues?.columns?.map((element) => ({
            content: element?.content,
            xs: element?.xs || 12,
            s: element?.s || 12,
            m: element?.m || 12,
            l: element?.l || 12,
            xl: element?.xl || 12,
            type: element?.type || 'text',
        })) || [],
    saveAsModel: 1,
    pageBlockType: (initValues) => initValues?.pageBlockType?.id || initValues?.pageBlockType || '',
    fields: (initValues) => initValues?.fields || {},
    class: (initValues) => initValues?.class || '',
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
            columns: {
                type: 'array',
                subFields: {
                    content: { type: 'string' },
                    type: { type: 'string' },
                    xs: { type: 'string' },
                    s: { type: 'string' },
                    m: { type: 'string' },
                    l: { type: 'string' },
                    xl: { type: 'string' },
                },
            },
            pageBlockType: { type: 'string' },
            class: { type: 'string' },
            fields: {
                function: ({ values, formData }) => {
                    Object.entries(values.fields)?.map(([key, value]) => {
                        serializeData(value, `fields[${key}]`, formData);
                    });
                },
            },
        },
    },
    pageColumnTypeFields: PAGE_COLUMN_TYPE_FIELDS,
    contentFields: CONTENT_FIELDS,
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
                    keyId: 'block-content',
                    fields: [
                        {
                            keyId: 'input-blocks',
                            style: { xs: 12 },
                            component: ({
                                setView,
                                view,
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                setFieldValue,
                                setFieldTouched,
                                getPageColumnTypeModules,
                                contentModules,
                                formCrud,
                                ...rest
                            }) => (
                                <Box sx={{ paddingLeft: 5 }} minHeight={200}>
                                    {!Boolean(values?.pageBlockType) && (
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
                                    )}

                                    {values.pageBlockType ? (
                                        <Component.PageBlockContentPart
                                            values={values}
                                            errors={errors}
                                            touched={touched}
                                            media={view}
                                            setFieldValue={setFieldValue}
                                            setFieldTouched={setFieldTouched}
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            prefixName={`fields.`}
                                            pageColumnTypeModules={getPageColumnTypeModules}
                                            formCrud={formCrud}
                                            contentModules={contentModules}
                                            {...rest}
                                        />
                                    ) : (
                                        <Component.PageBlockColumnPart
                                            values={values}
                                            errors={errors}
                                            touched={touched}
                                            media={view}
                                            setFieldValue={setFieldValue}
                                            setFieldTouched={setFieldTouched}
                                            pageColumnTypeModules={getPageColumnTypeModules}
                                        />
                                    )}
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

    const getPageColumnTypeModules = useMemo(() => {
        return formCrud.pageColumnTypeFields;
    }, []);

    const contentModules = useMemo(() => {
        return formCrud.contentFields;
    }, []);

    return (
        <Component.CmtCrudForm
            {...{
                createMode: !Boolean(initialValues),
                handleSubmit,
                view,
                setView,
                initialValues: initValues,
                modelValues,
                translateInitialValues,
                formCrud,
                getPageColumnTypeModules,
                contentModules,
                ...props,
            }}
        />
    );
};
