import React, { useEffect, useMemo, useState } from 'react';
import { FormHelperText } from '@mui/material';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { CONTENT_FIELDS } from '@Apps/Contents/services/config/getContentFields';
import { PAGE_COLUMN_TYPE_FIELDS } from '@Apps/PageBlocks/services/config/getPageColumnTypeFields';
import { SeoInitialValues, SeoApiDataFields, IndexSeoInitialFormInputs } from '@Apps/SEO/Form/SEOForm';

import { Component } from '@/AdminService/Component';
import { DEFAULT_CRUD_FORM_COMPONENTS, initYup } from '@Components/CmtCrudForm/CmtCrudForm';
import { changeSlug } from '@Services/utils/changeSlug';
import { constructInitialValues } from '@Services/utils/constructInitialValues';

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

const getValidation = (contentType, contentModule) => {
    if (!contentModule?.VALIDATION_TYPE || !contentModule?.VALIDATION_LIST) {
        return;
    }

    let validation = Yup[contentModule?.VALIDATION_TYPE]();

    const valList = { ...contentType.validations, ...contentType.options };

    contentModule?.VALIDATION_LIST?.forEach((element) => {
        const elVal = valList[element.name];
        if (elVal && element.test(elVal.value)) {
            validation = validation[element.validationName](...element.params({ name: contentType.title, value: elVal.value }));
        }
    });

    return validation;
};

const getFieldsValidation = (contentType, getContentModules) => {
    let validation = {};

    if (!contentType) {
        return Yup.object().nullable();
    }

    contentType.fields?.forEach((el) => {
        validation[el.name] = getContentModules[el.type]?.getValidation
            ? getContentModules[el.type].getValidation(el, getContentModules)
            : getValidation(el, getContentModules[el.type]);
    });

    return Yup.object().shape({ ...validation });
};

export const pagesInitialSchema = {
    title: (initValues) => initValues?.title || '',
    active: (initValues) => initValues?.active || false,
    parent: (initValues) => initValues?.parent?.id || '',
    subtitle: (initValues) => initValues?.subtitle || '',
    pageBlocks: (initValues) =>
        initValues?.pageBlocks?.map((pageBlock) => ({
            name: pageBlock.name,
            class: pageBlock.class || '',
            saveAsModel: false,
            pageBlockType: pageBlock?.pageBlockType?.id || '',
            fields: pageBlock?.fields || {},
            columns: pageBlock?.columns?.map((column) => ({
                ...column,
                content: column?.content,
                class: column?.class || '',
                xs: column?.xs || 12,
                s: column?.s || 12,
                m: column?.m || 12,
                l: column?.l || 12,
                xl: column?.xl || 12,
                type: column?.type || 'text',
            })),
            lang: pageBlock?.lang?.id || initValues?.lang?.id || '',
            languageGroup: pageBlock?.languageGroup || '',
        })) || [],
    slug: (initValues) => initValues?.slug || '',
    editSlug: false,
    lang: (initValues) => initValues?.lang?.id || '',
    languageGroup: (initValues) => initValues?.languageGroup || '',
    fields: (initValues) => initValues?.fields || {},
    contentType: (initValues, { contentType }) => initValues?.contentType?.id || contentType?.id,
    seo: SeoInitialValues,
};

export const pagesValidationSchema = {
    title: Yup.string().required('Veuillez renseigner le titre de la page.').max(250, 'Le nom renseigné est trop long.'),
    fields: ({ initValues, contentType }) => getFieldsValidation(initValues?.contentType || contentType),
    pageBlocks: ({ getPageColumnTypeModules }) =>
        Yup.array().of(
            Yup.object().shape({
                name: Yup.string().required('Veuillez renseigner le nom du bloc.').max(250, 'Le nom renseigné est trop long.'),
                columns: Yup.array().of(
                    Yup.object().shape({
                        type: Yup.string().required('Veuillez renseigner le type de votre champ'),
                        content: Yup.object().when('type', (type) => {
                            if (!type) {
                                return Yup.object().nullable();
                            }
                            // if (getPageColumnTypeModules[`${type}`]?.getValidation) {
                            //     return Yup.object().shape({
                            //         ...getPageColumnTypeModules[`${type}`].getValidation(),
                            //     });
                            // }
                            return Yup.object().nullable();
                        }),
                    })
                ),
            })
        ),
};

export const pagesForm = {
    submitLine: {
        activeInput: true,
        activeLabel: 'Page active ?',
    },
    infos: {
        seoIndexedLabel: 'Indexer cette page ?',
    },
    api: {
        dataFields: {
            active: { type: 'boolean' },
            title: { type: 'string' },
            parent: { type: 'string' },
            subtitle: { type: 'string' },
            slug: { type: 'slug' },
            lang: { type: 'string' },
            languageGroup: { type: 'string' },
            pageBlocks: {
                function: ({ values, formData }) => {
                    values.pageBlocks.forEach((block, index) => {
                        formData.append(`pageBlocks[${index}][name]`, block.name);
                        formData.append(`pageBlocks[${index}][class]`, block.class || '');
                        formData.append(`pageBlocks[${index}][saveAsModel]`, block.saveAsModel ? 1 : 0);
                        formData.append(`pageBlocks[${index}][lang]`, block.lang || '');
                        formData.append(`pageBlocks[${index}][languageGroup]`, block.languageGroup || '');
                        formData.append(`pageBlocks[${index}][pageBlockType]`, block.pageBlockType || '');

                        Object.entries(block.fields)?.map(([key, value]) => {
                            serializeData(value, `pageBlocks[${index}][fields][${key}]`, formData);
                        });

                        block.columns.forEach((column, columnIndex) => {
                            formData.append(`pageBlocks[${index}][columns][${columnIndex}][content]`, column.content);
                            formData.append(`pageBlocks[${index}][columns][${columnIndex}][class]`, column?.class || '');
                            formData.append(`pageBlocks[${index}][columns][${columnIndex}][xs]`, column.xs);
                            formData.append(`pageBlocks[${index}][columns][${columnIndex}][s]`, column.s);
                            formData.append(`pageBlocks[${index}][columns][${columnIndex}][m]`, column.m);
                            formData.append(`pageBlocks[${index}][columns][${columnIndex}][l]`, column.l);
                            formData.append(`pageBlocks[${index}][columns][${columnIndex}][xl]`, column.xl);
                            formData.append(`pageBlocks[${index}][columns][${columnIndex}][type]`, column?.type);
                        });
                    });
                },
            },
            seo: SeoApiDataFields,
        },
    },
    pageColumnTypeFields: PAGE_COLUMN_TYPE_FIELDS,
    contentFields: CONTENT_FIELDS,
    fields: [
        {
            type: 'tabs',
            keyId: 'page',
            label: 'Page',
            fields: [
                {
                    type: 'block',
                    title: 'Informations générales',
                    keyId: 'block-general-info',
                    fields: [
                        {
                            keyId: 'input-title',
                            style: { xs: 12, sm: 8 },
                            inputs: [
                                {
                                    name: 'title',
                                    label: 'Titre',
                                    inputType: 'textField',
                                    required: true,
                                    custom: {
                                        handleChange:
                                            ({ values, initialValues, setFieldValue }) =>
                                            (e) => {
                                                setFieldValue('title', e.target.value);
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
                            keyId: 'input-parent',
                            style: {
                                xs: 12,
                                sm: 4,
                            },
                            input: {
                                name: 'parent',
                                label: 'Page parente',
                                inputType: 'selectField',
                                listName: 'pagesList',
                                getName: (item) => item.title,
                                getValue: (item) => item.id,
                            },
                        },
                        {
                            keyId: 'input-subtitle',
                            style: { xs: 12 },
                            input: {
                                name: 'subtitle',
                                label: 'Introduction',
                                inputType: 'editorField',
                            },
                        },
                    ],
                },
                {
                    type: 'block',
                    title: 'Blocs',
                    keyId: 'block-blocks',
                    component: ({
                        initValue,
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        setFieldTouched,
                        setFieldValue,
                        contentType,
                        getPageColumnTypeModules,
                        ...rest
                    }) => {
                        return !contentType || contentType?.displayBlocks ? (
                            <Component.CmtFormBlock title="Blocs">
                                <Component.PagesBlocksPart
                                    values={values}
                                    errors={errors}
                                    touched={touched}
                                    setFieldValue={setFieldValue}
                                    setFieldTouched={setFieldTouched}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    initValue={initValue}
                                    pageColumnTypeModules={getPageColumnTypeModules}
                                    {...rest}
                                />

                                {errors?.pageBlocks && typeof errors?.pageBlocks === 'string' && <FormHelperText error>{errors.pageBlocks}</FormHelperText>}
                            </Component.CmtFormBlock>
                        ) : (
                            <></>
                        );
                    },
                },
                IndexSeoInitialFormInputs,
            ],
        },
    ],
    ...DEFAULT_CRUD_FORM_COMPONENTS,
};

export const PagesForm = ({ handleSubmit, initialValues = null, translateInitialValues = null, pagesList, contentType = null, formCrud, ...props }) => {
    const getContentModules = useMemo(() => {
        return formCrud.contentFields;
    }, []);

    const getPageColumnTypeModules = useMemo(() => {
        return formCrud.pageColumnTypeFields;
    }, []);

    return (
        <Formik
            initialValues={constructInitialValues(formCrud.form.initialSchema, translateInitialValues || initialValues, { pagesList, ...props })}
            validationSchema={Yup.object().shape(
                initYup(formCrud.form.validationSchema, { formCrud, initialValues, translateInitialValues, handleSubmit, getPageColumnTypeModules, ...props })
            )}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, submitForm, isSubmitting }) => (
                <Component.CmtPageWrapper
                    component="form"
                    onSubmit={handleSubmit}
                    title={formCrud?.form?.title}
                    /*actionButton={
                        initialValues && (
                            <Component.ActionButton
                                variant="contained"
                                sx={{ marginLeft: 'auto' }}
                                onClick={() => navigate(Constant.PAGE_HISTORY_BASE_PATH + `/${initialValues?.id}`)}
                            >
                                Historique de la page
                            </Component.ActionButton>
                        )
                    }*/
                >
                    <Component.CmtDisplayComponents
                        formCrud={formCrud}
                        list={formCrud.components}
                        initialValues={initialValues}
                        values={values}
                        errors={errors}
                        touched={touched}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        handleSubmit={handleSubmit}
                        setFieldTouched={setFieldTouched}
                        setFieldValue={setFieldValue}
                        isSubmitting={isSubmitting}
                        pagesList={pagesList}
                        contentType={contentType}
                        getContentModules={getContentModules}
                        getPageColumnTypeModules={getPageColumnTypeModules}
                        submitForm={submitForm}
                        {...props}
                    />
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
