import { Button, Container, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { CmtFormBlock } from '../../../Components/CmtFormBlock/CmtFormBlock';
import { CmtPageWrapper } from '../../../Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { CmtTextField } from '../../../Components/CmtTextField/CmtTextField';

export const CreateUserForm = ({ handleSubmit }) => {
    const userSchema = Yup.object().shape({
        firstName: Yup.string().required('Veuillez renseigner le prénom.'),
        lastName: Yup.string().required('Veuillez renseigner le nom.'),
        email: Yup.string()
            .email('Email invalide.')
            .required("Veuillez renseigner l'adresse email."),
        password: Yup.string()
            .min(9, 'Votre mot de passe doit contenir au moins 9 caractères.')
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
                <CmtPageWrapper
                    title={"Création d'un utilisateur"}
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <CmtFormBlock title={'Informations générales'}>
                        <CmtTextField
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Email"
                            name="email"
                            error={touched.email && errors.email}
                            required
                        />
                        <CmtTextField
                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Prénom"
                            name="firstName"
                            error={touched.firstName && errors.firstName}
                            required
                        />
                        <CmtTextField
                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Nom"
                            name="lastName"
                            error={touched.lastName && errors.lastName}
                            required
                        />
                    </CmtFormBlock>

                    <CmtFormBlock title="Sécurité">
                        <CmtTextField
                            value={values.password}
                            type="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Mot de passe"
                            name="password"
                            error={touched.password && errors.password}
                            required
                        />
                        <CmtTextField
                            type="password"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Confirmer le mot de passe"
                            name="confirmPassword"
                            error={touched.confirmPassword && errors.confirmPassword}
                            required
                        />
                    </CmtFormBlock>
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
                </CmtPageWrapper>
            )}
        </Formik>
    );
};
