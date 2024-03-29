import React, { useMemo } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Button, FormHelperText, Grid } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

import ContentTypesModules from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules';

export const ContentTypesForm = ({ initialValues = null, submitForm, pagesList }) => {
    const getContentTypesModules = useMemo(() => {
        return ContentTypesModules();
    }, []);

    const contentTypeSchema = Yup.object().shape({
        name: Yup.string().required('Veuillez renseigner le nom du type de contenus.'),
        pageParent: Yup.string().required('Veuillez renseigner la page parente.'),
        fields: Yup.array()
            .of(
                Yup.object().shape({
                    title: Yup.string().required('Veuillez renseigner le titre de votre champ.'),
                    name: Yup.string().required('Veuillez renseigner le nom de votre champ.'),
                    type: Yup.string().required('Veuillez renseigner le type de votre champ.'),
                    parameters: Yup.object().when('type', (type) => {
                        if (!type) {
                            return Yup.object().nullable();
                        }

                        if (getContentTypesModules[type]?.getValidation) {
                            return Yup.object().shape({
                                ...getContentTypesModules[type].getValidation(),
                            });
                        }

                        return Yup.object().nullable();
                    }),
                })
            )
            .required('Veuillez renseigner un champ')
            .min(1, 'Veuillez renseigner au moins un type de champs'),
    });

    return (
        <Formik
            initialValues={{
                name: initialValues?.name || '',
                active: initialValues?.active || false,
                fields: initialValues?.fields || [],
                pageParent: initialValues?.pageParent?.id || '',
                maxObjectNb: initialValues?.maxObjectNb || '',
                keyword: initialValues?.keyword || '',
                pageType: initialValues?.pageType || false,
            }}
            validationSchema={contentTypeSchema}
            onSubmit={async (values, { setSubmitting }) => {
                await submitForm(values);
                setSubmitting(false);
            }}
            validateOnChange={false}
            validateOnBlur
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, isSubmitting }) => (
                <Component.CmtPageWrapper component="form" onSubmit={handleSubmit} title={`${initialValues ? 'Modification' : 'Création'} d'un type de contenus`}>
                    <Component.CmtFormBlock title="Informations générales">
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6}>
                                <Component.CmtTextField
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Nom du type de contenus"
                                    required
                                    name="name"
                                    error={touched.name && errors.name}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Component.CmtSelectField
                                    label="Page parente"
                                    required
                                    name={`pageParent`}
                                    value={values.pageParent}
                                    list={pagesList}
                                    getValue={(item) => item.id}
                                    getName={(item) => item.title}
                                    setFieldValue={setFieldValue}
                                    errors={touched.pageParent && errors.pageParent}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Component.CmtTextField
                                    value={values.maxObjectNb}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Nombre maximum d'objet"
                                    name="maxObjectNb"
                                    error={touched.maxObjectNb && errors.maxObjectNb}
                                    type={'number'}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Component.CmtKeywordInput values={values} setFieldValue={setFieldValue} name="keyword" />
                            </Grid>
                        </Grid>
                    </Component.CmtFormBlock>
                    <Component.CmtFormBlock title="Champs">
                        <Component.ContentTypeFieldArrayForm
                            contentTypesModules={getContentTypesModules}
                            values={values}
                            errors={errors}
                            touched={touched}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                        />

                        {errors?.fields && typeof errors?.fields === 'string' && (
                            <FormHelperText error id="fields-helper-text">
                                {errors.fields}
                            </FormHelperText>
                        )}
                    </Component.CmtFormBlock>
                    <Box display="flex" justifyContent="flex-end" sx={{ pt: 3, pb: 2 }}>
                        <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text="Type de contenu actif ?" />

                        <Button type="submit" variant="contained" disabled={isSubmitting} id="submitForm">
                            {initialValues ? 'Modifier' : 'Créer'}
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
