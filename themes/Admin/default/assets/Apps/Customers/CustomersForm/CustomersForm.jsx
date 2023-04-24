import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Button, Grid } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

const CUSTOMER_TYPE = [
    { value: 'M.', label: 'Monsieur' },
    { value: 'Mme', label: 'Madame' },
];

export const CustomersForm = ({ handleSubmit, initialValues = null }) => {
    const customerSchema = Yup.object().shape({
        firstName: Yup.string().required('Veuillez renseigner le prénom.'),
        lastName: Yup.string().required('Veuillez renseigner le nom.'),
        email: Yup.string().email('Email invalide.').required("Veuillez renseigner l'adresse email."),
        civility: Yup.string().required('Veuillez renseigner la civilité du client'),
        plainPassword: Yup.string().when('isNewCustomer', (isNewCustomer) => {
            let test = isNewCustomer ? Yup.string().required('Veuillez renseigner un mot de passe') : Yup.string().nullable();

            return test
                .min(10, 'Votre mot de passe doit contenir au moins 10 caractères.')
                .matches(
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{9,}$/,
                    'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spéciale.'
                );
        }),
        confirmPassword: Yup.string().when('plainPassword', (plainPassword) => {
            if (plainPassword) {
                return Yup.string()
                    .oneOf([Yup.ref('plainPassword')], 'Le mot de passe ne correspond pas.')
                    .required('Veuillez confirmer le mot de passe.');
            }
        }),
    });

    return (
        <Formik
            initialValues={{
                firstName: initialValues?.firstName || '',
                lastName: initialValues?.lastName || '',
                email: initialValues?.email || '',
                civility: initialValues?.civility || '',
                plainPassword: '',
                confirmPassword: '',
                active: initialValues?.active || false,
                isNewCustomer: !Boolean(initialValues),
            }}
            validationSchema={customerSchema}
            onSubmit={async (values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, setFieldValue, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                <Component.CmtPageWrapper title={`${initialValues ? 'Modification' : 'Création'} d'un client`} component="form" onSubmit={handleSubmit}>
                    <Component.CmtFormBlock title={'Informations générales'}>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <Component.CmtTextField
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Email"
                                    name="email"
                                    error={touched.email && errors.email}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={2}>
                                <Component.CmtSelectField
                                    label="Titre"
                                    required
                                    name={`civility`}
                                    value={values.civility}
                                    list={CUSTOMER_TYPE}
                                    getValue={(item) => item.value}
                                    getName={(item) => item.label}
                                    setFieldValue={setFieldValue}
                                    errors={touched.civility && errors.civility}
                                />
                            </Grid>

                            <Grid item xs={12} sm={5}>
                                <Component.CmtTextField
                                    value={values.firstName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Prénom"
                                    name="firstName"
                                    error={touched.firstName && errors.firstName}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={5}>
                                <Component.CmtTextField
                                    value={values.lastName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Nom"
                                    name="lastName"
                                    error={touched.lastName && errors.lastName}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </Component.CmtFormBlock>

                    <Component.CmtFormBlock title="Sécurité">
                        <Component.CmtTextField
                            value={values.plainPassword}
                            type="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Mot de passe"
                            name="plainPassword"
                            required={values.isNewCustomer}
                            error={touched.plainPassword && errors.plainPassword}
                        />

                        <Component.CmtTextField
                            type="password"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Confirmer le mot de passe"
                            name="confirmPassword"
                            required={values.isNewCustomer}
                            error={touched.confirmPassword && errors.confirmPassword}
                        />
                    </Component.CmtFormBlock>
                    <Box display="flex" justifyContent={'flex-end'} sx={{ pt: 3, pb: 2 }}>
                        <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text="Utilisateur actif ?" />

                        <Button type="submit" variant="contained" disabled={isSubmitting} id="submitForm">
                            Modifier
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
