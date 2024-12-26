import React, { useEffect, useMemo, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Component } from '@/AdminService/Component';
import { CONTENT_FIELDS } from '@Apps/Contents/services/config/getContentFields';
import { SeoInitialValues, SeoApiDataFields, IndexSeoInitialFormInputs } from '@Apps/SEO/Form/SEOForm';
import { DEFAULT_CRUD_FORM_COMPONENTS, initYup } from '@Components/CmtCrudForm/CmtCrudForm';
import { changeSlug } from '@Services/utils/changeSlug';
import { constructInitialValues } from '@Services/utils/constructInitialValues';
import { useNavigate } from 'react-router-dom';
import { Constant } from '@/AdminService/Constant';

const ROLE_CONTENT_PUBLISH = 'ROLE_CONTENT_PUBLISH';

const getInitPublishedStatus = (initValues, userRoles) => {
    if (initValues?.publicationStatus !== 'PUBLISHED' || checkUserAccess(userRoles, ROLE_CONTENT_PUBLISH)) {
        return initValues?.publicationStatus || 'DRAFT';
    }

    return 'DRAFT';
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

    contentType.fields?.forEach((el) => {
        validation[el.name] = getContentModules[el.type]?.getValidation
            ? getContentModules[el.type].getValidation(el, getContentModules)
            : getValidation(el, getContentModules[el.type]);
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
    publicationStatus: (initValues, { userRoles }) => getInitPublishedStatus(initValues, userRoles),
    contentType: (initValues, { contentType }) => initValues?.contentType?.id || contentType?.id,
    editSlug: false,
    seo: SeoInitialValues,
};

export const contentsValidationSchema = {
    title: Yup.string().required('Veuillez renseigner le titre de la page.').max(250, 'Le nom renseigné est trop long.'),
    fields: ({ initialValues, contentType, getContentModules }) => getFieldsValidation(initialValues?.contentType || contentType, getContentModules),
};

export const contentsForm = {
    submitLine: {
        activeInput: true,
        activeLabel: 'Page active ?',
    },
    infos: {
        seoIndexedLabel: 'Indexer ce contenu ?',
    },
    api: {
        dataFields: {
            active: { type: 'boolean' },
            title: { type: 'string' },
            slug: { type: 'slug' },
            publicationStatus: { type: 'string' },
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
    contentFields: CONTENT_FIELDS,
    publicationStatusList: [
        { value: 'PUBLISHED', label: 'Publié' },
        { value: 'TO_VALIDATE', label: 'À valider' },
        { value: 'DRAFT', label: 'Brouillon' },
    ],
    fields: [
        {
            type: 'tabs',
            keyId: 'tab-general-info',
            label: 'Informations générales',
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
                        {
                            keyId: 'input-publicationStatus',
                            style: {
                                xs: 12,
                                sm: 4,
                            },
                            input: {
                                name: 'publicationStatus',
                                label: 'Status de publication',
                                inputType: 'selectField',
                                listName: 'publicationStatusList',
                                getName: (item) => item.label,
                                getValue: (item) => item.value,
                                required: true,
                            },
                        },
                    ],
                },
                IndexSeoInitialFormInputs,
            ],
        },
        {
            type: 'tabs',
            keyId: 'tab-contents',
            label: 'Formulaire',
            fields: [
                {
                    type: 'block',
                    title: 'Formulaire',
                    keyId: 'block-fields',
                    component: ({ values, errors, touched, handleBlur, handleChange, setFieldTouched, setFieldValue, selectedContentType, getContentModules, ...props }) => {
                        return (
                            <Component.CmtFormBlock title="Formulaire">
                                <Component.DisplayContentForm
                                    {...props}
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
            ],
        },
    ],
    ...DEFAULT_CRUD_FORM_COMPONENTS,
};

export const ContentsForm = ({ initialValues = null, handleSubmit, selectedContentType, translateInitialValues = null, formCrud, ...props }) => {
    const navigate = useNavigate();
    const [initValue, setInitValue] = useState(null);

    const getContentModules = useMemo(() => {
        return formCrud.contentFields;
    }, []);

    useEffect(() => {
        let initVal = translateInitialValues || initialValues;
        if (initVal) {
            setInitValue(constructInitialValues(formCrud.form.initialSchema, initVal, { contentType: selectedContentType, ...props }));
            return;
        }

        let fields = {};
        const formModules = getContentModules;
        selectedContentType?.fields?.forEach((el) => {
            fields[el.name] = formModules[el.type]?.getInitialValue(el, getContentModules) || '';
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
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, submitForm, isSubmitting }) => (
                <Component.CmtPageWrapper
                    component="form"
                    onSubmit={handleSubmit}
                    title={`${initialValues ? 'Modification' : 'Création'} d'un contenu`}
                    actionButton={
                        initialValues && (
                            <Component.ActionButton
                                variant="contained"
                                sx={{ marginLeft: 'auto' }}
                                onClick={() => navigate(Constant.CONTENT_HISTORY_BASE_PATH + `/${initialValues?.id}`)}
                            >
                                Historique du contenu
                            </Component.ActionButton>
                        )
                    }
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
                        selectedContentType={selectedContentType}
                        getContentModules={getContentModules}
                        submitForm={submitForm}
                        {...props}
                    />
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
