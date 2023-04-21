import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Box } from '@mui/system';
import { Button, FormHelperText, Grid } from '@mui/material';

import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { changeSlug } from '@Services/utils/changeSlug';
import ContentModules from '@Apps/Contents/ContentsForm/ContentModules';

export const PagesForm = ({ handleSubmit, initialValues = null, translateInitialValues = null, pagesList, contentType = null }) => {
    const [initValue, setInitValue] = useState(null);
    const navigate = useNavigate();

    const getContentModules = useMemo(() => {
        return ContentModules();
    }, []);

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

    const getFieldsValidation = (contentType) => {
        let validation = {};

        if (!contentType) {
            return Yup.object().nullable();
        }

        contentType.fields?.forEach((el) => {
            validation[el.name] = getContentModules[el.type]?.getValidation ? getContentModules[el.type].getValidation(el) : getValidation(el, getContentModules[el.type]);
        });

        return Yup.object().shape({ ...validation });
    };

    let pageValidationSchema = useMemo(() => {
        return Yup.object().shape({
            title: Yup.string().required('Veuillez renseigner le titre de la page.').max(250, 'Le nom renseigné est trop long.'),
            fields: getFieldsValidation(initialValues?.contentType || contentType),
            pageBlocks: Yup.array().of(
                Yup.object().shape({
                    name: Yup.string().required('Veuillez renseigner le nom du bloc.').max(250, 'Le nom renseigné est trop long.'),
                })
            ),
        });
    }, []);

    useEffect(() => {
        let initVal = translateInitialValues || initialValues;

        if (initVal) {
            setInitValue({
                title: initVal?.title || '',
                active: initVal?.active || false,
                parent: initVal?.parent?.id || '',
                subtitle: initVal?.subtitle || '',
                pageBlocks:
                    initVal?.pageBlocks?.map((pageBlock) => ({
                        name: pageBlock.name,
                        blockType: pageBlock?.blockType || 0,
                        saveAsModel: false,
                        columns: pageBlock?.columns?.map((column) => ({
                            content: column?.content,
                            xs: column?.xs || 12,
                            s: column?.s || 12,
                            m: column?.m || 12,
                            l: column?.l || 12,
                            xl: column?.xl || 12,
                        })),
                        lang: pageBlock?.lang?.id || initVal?.lang?.id || '',
                        languageGroup: pageBlock?.languageGroup || '',
                    })) || [],
                slug: initVal?.slug || '',
                editSlug: false,
                lang: initVal?.lang?.id || '',
                languageGroup: initVal?.languageGroup || '',
                fields: { ...initVal?.fields },
                contentType: initVal?.contentType?.id || contentType?.id,
                seo: {
                    metaTitle: initVal?.metaTitle || '',
                    metaDescription: initVal?.metaDescription || '',
                    socialImage: initVal?.socialImage || null,
                    fbTitle: initVal?.fbTitle || '',
                    fbDescription: initVal?.fbDescription || '',
                    twTitle: initVal?.twTitle || '',
                    twDescription: initVal?.twDescription || '',
                },
            });

            return;
        }

        const formModules = getContentModules;

        let fields = {};

        contentType?.fields?.forEach((el) => {
            fields[el.name] = formModules[el.type]?.getInitialValue(el) || '';
        });

        setInitValue({
            title: '',
            active: false,
            parent: '',
            subtitle: '',
            pageBlocks: [],
            slug: '',
            fields: fields,
            contentType: contentType?.id,
            lang: '',
            languageGroup: '',
            editSlug: false,
            seo: {
                metaTitle: '',
                metaDescription: '',
                socialImage: null,
                fbTitle: '',
                fbDescription: '',
                twTitle: '',
                twDescription: '',
            },
        });
    }, []);

    if (!initValue) {
        return <></>;
    }

    return (
        <Formik
            initialValues={initValue}
            validationSchema={pageValidationSchema}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, isSubmitting }) => (
                <Component.CmtPageWrapper
                    component="form"
                    onSubmit={handleSubmit}
                    title={`${initialValues ? 'Modification' : 'Création'} d'une page`}
                    actionButton={
                        initialValues && (
                            <Component.ActionButton
                                variant="contained"
                                sx={{ marginLeft: 'auto' }}
                                onClick={() => navigate(Constant.PAGE_HISTORY_BASE_PATH + `/${initialValues?.id}`)}
                            >
                                Historique de la page
                            </Component.ActionButton>
                        )
                    }
                >
                    <Component.CmtFormBlock title="Informations générales">
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={8}>
                                <Component.CmtTextField
                                    label="Titre"
                                    required
                                    name="title"
                                    value={values.title}
                                    onChange={(e) => {
                                        setFieldValue('title', e.target.value);
                                        if (!values.editSlug && !initialValues) {
                                            setFieldValue('slug', changeSlug(e.target.value));
                                        }
                                    }}
                                    onBlur={handleBlur}
                                    error={touched.title && errors.title}
                                />
                                <Component.CmtSlugInput values={values} setFieldValue={setFieldValue} name="slug" />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Component.CmtSelectField
                                    label="Page parente"
                                    name={`parent`}
                                    value={values.parent}
                                    list={pagesList?.filter((item) => item.id !== initValue?.id)}
                                    getValue={(item) => item.id}
                                    getName={(item) => item.title}
                                    setFieldValue={setFieldValue}
                                    errors={touched.parent && errors.parent}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Component.CmtEditorField
                                    label="Introduction"
                                    name={`subtitle`}
                                    value={values.subtitle}
                                    setFieldValue={setFieldValue}
                                    setFieldTouched={setFieldTouched}
                                    errors={touched.subtitle && errors.subtitle}
                                />
                            </Grid>
                        </Grid>
                    </Component.CmtFormBlock>

                    {contentType && (
                        <Component.CmtFormBlock title="Champs">
                            <Component.DisplayContentForm
                                values={values.fields}
                                errors={errors}
                                touched={touched}
                                handleBlur={handleBlur}
                                handleChange={handleChange}
                                setFieldTouched={setFieldTouched}
                                setFieldValue={setFieldValue}
                                contentType={contentType}
                                contentModules={getContentModules}
                                prefixName="fields."
                            />
                        </Component.CmtFormBlock>
                    )}

                    {(!contentType || contentType?.displayBlocks) && (
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
                            />

                            {errors?.pageBlocks && typeof errors?.pageBlocks === 'string' && <FormHelperText error>{errors.pageBlocks}</FormHelperText>}
                        </Component.CmtFormBlock>
                    )}

                    <Component.SEOForm values={values} setFieldValue={setFieldValue} handleChange={handleChange} handleBlur={handleBlur} touched={touched} errors={errors} />

                    <Box display="flex" justifyContent="flex-end" sx={{ pt: 3, pb: 2 }}>
                        <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text="Page active ?" />

                        <Button type="submit" variant="contained" id="submitForm" disabled={isSubmitting}>
                            {initialValues ? 'Modifier' : 'Créer'}
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
