import React, { useMemo } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Button, Checkbox, FormControlLabel, FormHelperText, Grid } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

import ContentTypesModules from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules';

export const PageTypesForm = ({ initialValues = null, submitForm, pagesList }) => {
    const getContentTypesModules = useMemo(() => {
        return ContentTypesModules();
    }, []);

    const contentTypeSchema = Yup.object().shape({
        name: Yup.string().required('Veuillez renseigner le nom du type de contenus.'),
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
                maxObjectNb: initialValues?.maxObjectNb || '',
                pageType: initialValues?.pageType || true,
                displayBlocks: initialValues?.displayBlocks || false,
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
                <Component.CmtPageWrapper component="form" onSubmit={handleSubmit} title={`${initialValues ? 'Modification' : 'Création'} d'un type de page`}>
                    <Component.CmtFormBlock title="Informations générales">
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Component.CmtTextField
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Nom du type de page"
                                    required
                                    name="name"
                                    error={touched.name && errors.name}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
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

                            <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                                <FormControlLabel
                                    size="small"
                                    value={values.displayBlocks}
                                    onChange={(e) => {
                                        setFieldValue(`displayBlocks`, e.target.checked);
                                    }}
                                    label={'Afficher les blocs classiques sur les pages'}
                                    labelPlacement="end"
                                    control={<Checkbox checked={Boolean(values.displayBlocks)} />}
                                />
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
                        <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text="Type de page actif ?" />

                        <Button type="submit" variant="contained" disabled={isSubmitting} id="submitForm">
                            {initialValues ? 'Modifier' : 'Créer'}
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
