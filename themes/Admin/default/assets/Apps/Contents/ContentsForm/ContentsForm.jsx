import React, { useEffect, useMemo, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Component } from '@/AdminService/Component';

import ContentModules from '@Apps/Contents/ContentsForm/ContentModules';
import { constructInitialValues } from '@Services/utils/constructInitialValues';
import { SeoInitialValues, SeoInitialFormInputs, SeoApiDataFields } from '@Apps/SEO/Form/SEOForm';
import { changeSlug } from '@Services/utils/changeSlug';
import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';
import { initYup } from '@Components/CmtCrudForm/CmtCrudForm';

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

    contentType.fields?.forEach((el) => {
        validation[el.name] = getContentModules[el.type]?.getValidation ? getContentModules[el.type].getValidation(el) : getValidation(el, getContentModules[el.type]);
    });

    return Yup.object().shape({ ...validation });
};

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

export const contentsInitialSchema = {
    title: (initValues) => initValues?.title || '',
    active: (initValues) => initValues?.active || false,
    slug: (initValues) => initValues?.slug || '',
    lang: (initValues) => initValues?.lang?.id || '',
    languageGroup: (initValues) => initValues?.languageGroup || '',
    fields: (initValues) => initValues?.fields || {},
    contentType: (initValues, { contentType }) => initValues?.contentType?.id || contentType?.id,
    page: (initValues) => initValues?.page?.id || '',
    editSlug: false,
    seo: SeoInitialValues,
};

export const contentsValidationSchema = {
    title: Yup.string().required('Veuillez renseigner le titre de la page.').max(250, 'Le nom renseigné est trop long.'),
    fields: ({ initialValues, contentType, getContentModules }) => getFieldsValidation(initialValues?.contentType || contentType, getContentModules),
    pageBlocks: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required('Veuillez renseigner le nom du bloc.').max(250, 'Le nom renseigné est trop long.'),
        })
    ),
};

export const contentsForm = {
    submitLine: {
        activeInput: true,
        activeLabel: 'Page active ?',
    },
    api: {
        dataFields: {
            active: { type: 'boolean' },
            title: { type: 'string' },
            page: {
                function: ({ values, formData }) => {
                    if (values.page) {
                        formData.append('page', values.page);
                    }
                },
            },
            slug: { type: 'slug' },
            lang: { type: 'string' },
            languageGroup: { type: 'string' },
            fields: {
                function: ({ values, formData }) => {
                    Object.entries(values.fields)?.map(([key, value]) => {
                        serializeData(value, `fields[${key}]`, formData);
                    });
                },
            },
            seo: SeoApiDataFields,
        },
    },
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
                            style: { xs: 12 },
                            inputs: [
                                {
                                    name: 'title',
                                    label: 'Titre du contenu',
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
                    ],
                },
                {
                    type: 'block',
                    title: 'Formulaire',
                    keyId: 'block-fields',
                    component: ({ values, errors, touched, handleBlur, handleChange, setFieldTouched, setFieldValue, selectedContentType, getContentModules }) => {
                        return (
                            <Component.CmtFormBlock title="Formulaire">
                                <Component.DisplayContentForm
                                    values={values.fields}
                                    errors={errors}
                                    touched={touched}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    setFieldTouched={setFieldTouched}
                                    setFieldValue={setFieldValue}
                                    contentType={selectedContentType}
                                    contentModules={getContentModules}
                                    prefixName="fields."
                                />
                            </Component.CmtFormBlock>
                        );
                    },
                },
                SeoInitialFormInputs,
            ],
        },
    ],
    ...DEFAULT_CRUD_FORM_COMPONENTS,
};

export const ContentsForm = ({ initialValues = null, handleSubmit, selectedContentType, translateInitialValues = null, formCrud, ...props }) => {
    const [initValue, setInitValue] = useState(null);

    const getContentModules = useMemo(() => {
        return ContentModules();
    }, []);

    useEffect(() => {
        let initVal = translateInitialValues || initialValues;

        if (initVal) {
            setInitValue(constructInitialValues(formCrud.form.initialSchema, initVal, { contentType: selectedContentType, ...props }));

            return;
        }

        const formModules = getContentModules;

        let fields = {};

        selectedContentType?.fields?.forEach((el) => {
            fields[el.name] = formModules[el.type]?.getInitialValue(el) || '';
        });

        setInitValue(constructInitialValues(formCrud.form.initialSchema, { fields }, { contentType: selectedContentType, ...props }));
    }, []);

    if (!initValue) {
        return <></>;
    }

    return (
        <Formik
            initialValues={initValue}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
            validationSchema={Yup.object().shape(
                initYup(formCrud.form.validationSchema, {
                    formCrud,
                    initialValues,
                    translateInitialValues,
                    handleSubmit,
                    getContentModules,
                    contentType: selectedContentType,
                    ...props,
                })
            )}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, isSubmitting }) => (
                <Component.CmtPageWrapper component="form" onSubmit={handleSubmit} title={`${initialValues ? 'Modification' : 'Création'} d'un contenu`}>
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
                        selectedContentType={selectedContentType}
                        getContentModules={getContentModules}
                        {...props}
                    />
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
