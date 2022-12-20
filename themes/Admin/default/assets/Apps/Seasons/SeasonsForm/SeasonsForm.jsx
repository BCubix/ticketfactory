import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Button, FormControlLabel, Grid, Switch, Box } from '@mui/material';

import { Component } from '@/AdminService/Component';

export const SeasonsForm = ({ handleSubmit, initialValues = null }) => {
    const seasonsSchema = Yup.object().shape({
        name: Yup.string().required('Veuillez renseigner le nom de la saison.').max(250, 'Le nom renseigné est trop long.'),
        beginYear: Yup.number()
            .required("Veuillez renseigner l'année de début.")
            .min(1970, 'Veuillez renseigner une année valide.')
            .max(2100, 'Veuillez renseigner une année valide.'),
    });

    return (
        <Formik
            initialValues={{
                name: initialValues?.name || '',
                active: initialValues?.active || false,
                beginYear: initialValues?.beginYear || '',
            }}
            validationSchema={seasonsSchema}
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
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Nom"
                                    name="name"
                                    error={touched.name && errors.name}
                                    required
                                />
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
