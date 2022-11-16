import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Button } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from "@/AdminService/Component";

export const CreateUserForm = ({ handleSubmit }) => {
    const userSchema = Yup.object().shape({
        firstName: Yup.string().required('Veuillez renseigner le prénom.'),
        lastName: Yup.string().required('Veuillez renseigner le nom.'),
        email: Yup.string()
            .email('Email invalide.')
            .required("Veuillez renseigner l'adresse email."),
        password: Yup.string()
            .min(10, 'Votre mot de passe doit contenir au moins 10 caractères.')
            .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{9,}$/,
                'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spéciale.'
            )
            .required('Veuillez renseigner un mot de passe.'),
        confirmPassword: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'Le mot de passe ne correspond pas.'
        ),
    });

    return (
        <Formik
            initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
            }}
            validationSchema={userSchema}
            onSubmit={async (values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
            }) => (
                <Component.CmtPageWrapper
                    title={"Création d'un utilisateur"}
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <Component.CmtFormBlock title={'Informations générales'}>
                        <Component.CmtTextField
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Email"
                            name="email"
                            error={touched.email && errors.email}
                            required
                        />
                        <Component.CmtTextField
                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Prénom"
                            name="firstName"
                            error={touched.firstName && errors.firstName}
                            required
                        />
                        <Component.CmtTextField
                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Nom"
                            name="lastName"
                            error={touched.lastName && errors.lastName}
                            required
                        />
                    </Component.CmtFormBlock>

                    <Component.CmtFormBlock title="Sécurité">
                        <Component.CmtTextField
                            value={values.password}
                            type="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Mot de passe"
                            name="password"
                            error={touched.password && errors.password}
                            required
                        />
                        <Component.CmtTextField
                            type="password"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Confirmer le mot de passe"
                            name="confirmPassword"
                            error={touched.confirmPassword && errors.confirmPassword}
                            required
                        />
                    </Component.CmtFormBlock>
                    <Box display="flex" justifyContent={'flex-end'}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isSubmitting}
                        >
                            Créer
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
