import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Button, Grid, Box } from '@mui/material';

import { Component } from '@/AdminService/Component';
import { changeSlug } from '@Services/utils/changeSlug';
import { constructInitialValues } from '@Services/utils/constructInitialValues';

const LIST = {
    form: {
        initialSchema: {
            name: (initValues) => initValues?.name || '',
            active: (initValues) => initValues?.active || false,
            beginYear: (initValues) => initValues?.beginYear || '',
            slug: (initValues) => initValues?.slug || '',
            lang: (initValues) => initValues?.lang?.id || '',
            languageGroup: (initValues) => initValues?.languageGroup || '',
            editSlug: false,
            seo: {
                metaTitle: (initValues) => initValues?.metaTitle || '',
                metaDescription: (initValues) => initValues?.metaDescription || '',
                socialImage: (initValues) => initValues?.socialImage || null,
                fbTitle: (initValues) => initValues?.fbTitle || '',
                fbDescription: (initValues) => initValues?.fbDescription || '',
                twTitle: (initValues) => initValues?.twTitle || '',
                twDescription: (initValues) => initValues?.twDescription || '',
            },
        },
        validationSchema: {
            name: Yup.string().required('Veuillez renseigner le nom de la saison.').max(250, 'Le nom renseigné est trop long.'),
            beginYear: Yup.number()
                .required("Veuillez renseigner l'année de début.")
                .min(1970, 'Veuillez renseigner une année valide.')
                .max(2100, 'Veuillez renseigner une année valide.'),
        },
    },
    components: [
        {
            id: 'form',
            component: (props) => <FormikSeason {...props} />,
        },
    ],
};

export const SeasonsForm = ({ handleSubmit, initialValues = null, translateInitialValues = null, ...componentProps }) => {
    let initValues = translateInitialValues || initialValues;

    return (
        <>
            {LIST.components.map((elem, index) => {
                const { component, ...props } = elem;
                const Component = component;

                if (!Component) {
                    return <></>;
                }

                return (
                    <Component
                        key={index}
                        initValues={initValues}
                        handleSubmit={handleSubmit}
                        initialValues={initialValues}
                        translateInitialValues={translateInitialValues}
                        initialSchema={LIST.form.initialSchema}
                        validationSchema={Yup.object().shape(LIST.form.validationSchema)}
                        {...componentProps}
                        {...props}
                    />
                );
            })}
        </>
    );
};

const FormikSeason = ({ initialValues, initValues, initialSchema, validationSchema, handleSubmit }) => {
    return (
        <Formik
            initialValues={constructInitialValues(initialSchema, initValues)}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
                <Component.CmtPageWrapper component="form" onSubmit={handleSubmit} title={`${initialValues ? 'Modification' : 'Création'} d'une saison`}>
                    <Component.CmtFormBlock title={'Informations générales'}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Component.CmtTextField
                                    value={values.name}
                                    onChange={(e) => {
                                        setFieldValue('name', e.target.value);
                                        if (!values.editSlug && !initialValues) {
                                            setFieldValue('slug', changeSlug(e.target.value));
                                        }
                                    }}
                                    onBlur={handleBlur}
                                    label="Nom"
                                    name="name"
                                    error={touched.name && errors.name}
                                    required
                                />
                                <Component.CmtSlugInput values={values} setFieldValue={setFieldValue} name="slug" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Component.CmtTextField
                                    type="number"
                                    value={values.beginYear}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Année de début"
                                    name="beginYear"
                                    error={touched.beginYear && errors.beginYear}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </Component.CmtFormBlock>

                    <Component.SEOForm values={values} setFieldValue={setFieldValue} handleChange={handleChange} handleBlur={handleBlur} touched={touched} errors={errors} />

                    <Box display="flex" justifyContent={'flex-end'} sx={{ pt: 3, pb: 2 }}>
                        <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text="Saison active ?" />

                        <Button type="submit" variant="contained" id="submitForm" disabled={isSubmitting}>
                            {initialValues ? 'Modifier' : 'Créer'}
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
