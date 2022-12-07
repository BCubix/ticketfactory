import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Button, FormControlLabel, Grid, Switch } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

export const ContactRequestsForm = ({ handleSubmit, initialValues = null }) => {
    const contactRequestSchema = Yup.object().shape({
        firstName: Yup.string().required('Veuillez renseigner le prénom.'),
        lastName: Yup.string().required('Veuillez renseigner le nom.'),
        email: Yup.string().required("Veuillez renseigner l'adresse email.").email('Email invalide'),
        phone: Yup.string()
            .required('Veuillez renseigner le numéro de téléphone.')
            .matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, 'Le numéro est invalide.'),
        subject: Yup.string().required("Veuillez renseigner l'object de la demande."),
        message: Yup.string().required('Veuillez renseigner le message.'),
    });

    return (
        <Formik
            initialValues={{
                active: initialValues?.active || false,
                firstName: initialValues?.firstName || '',
                lastName: initialValues?.lastName || '',
                email: initialValues?.email || '',
                phone: initialValues?.phone || '',
                subject: initialValues?.subject || '',
                message: initialValues?.message || '',
            }}
            validationSchema={contactRequestSchema}
            onSubmit={async (values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
                <Component.CmtPageWrapper component="form" onSubmit={handleSubmit} title={`${initialValues ? 'Modification' : 'Création'} d'une demande de contact`}>
                    <Component.CmtFormBlock title="Informations générales">
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <Component.CmtTextField
                                    value={values.firstName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label={'Prénom'}
                                    name="firstName"
                                    error={touched.firstName && errors.firstName}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <Component.CmtTextField
                                    value={values.lastName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label={'Nom'}
                                    name="lastName"
                                    error={touched.lastName && errors.lastName}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <Component.CmtTextField
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label={'Email'}
                                    name="email"
                                    error={touched.email && errors.email}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <Component.CmtTextField
                                    value={values.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label={'Numéro de téléphone'}
                                    name="phone"
                                    error={touched.phone && errors.phone}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Component.CmtTextField
                                    value={values.subject}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label={'Objet'}
                                    name="subject"
                                    error={touched.subject && errors.subject}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Component.CmtTextField
                                    value={values.message}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label={'Message'}
                                    name="message"
                                    error={touched.message && errors.message}
                                    multiline
                                    rows={5}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </Component.CmtFormBlock>
                    <Box display="flex" justifyContent={'flex-end'} sx={{ pt: 3, pb: 2 }}>
                        <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text="Demande de contact active ?" />

                        <Button type="submit" variant="contained" disabled={isSubmitting}>
                            {initialValues ? 'Modifier' : 'Créer'}
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
