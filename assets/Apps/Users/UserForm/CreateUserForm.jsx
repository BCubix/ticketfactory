import { Button, Container, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';

export const CreateUserForm = ({ handleSubmit, initialValues = null }) => {
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
            initialValues={
                initialValues
                    ? initialValues
                    : {
                          firstName: '',
                          lastName: '',
                          email: '',
                          password: '',
                          confirmPassword: '',
                      }
            }
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
                <Container maxWidth="sm">
                    <Box component="form" onSubmit={handleSubmit} sx={{ margin: 5 }}>
                        <TextField
                            margin="normal"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                        />
                        <TextField
                            margin="normal"
                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            fullWidth
                            id="firstName"
                            label="Prénom"
                            name="firstName"
                            autoComplete="firstName"
                            error={touched.firstName && Boolean(errors.firstName)}
                            helperText={touched.firstName && errors.firstName}
                        />
                        <TextField
                            margin="normal"
                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            fullWidth
                            id="lastName"
                            label="Nom"
                            name="lastName"
                            autoComplete="lastName"
                            error={touched.lastName && Boolean(errors.lastName)}
                            helperText={touched.lastName && errors.lastName}
                        />
                        <TextField
                            margin="normal"
                            value={values.password}
                            type="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            fullWidth
                            id="password"
                            label="Mot de passe"
                            name="password"
                            autoComplete="password"
                            error={touched.password && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                        />
                        <TextField
                            margin="normal"
                            type="password"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            fullWidth
                            id="confirmPassword"
                            label="Confirmer le mot de passe"
                            name="confirmPassword"
                            autoComplete="confirmPassword"
                            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                            helperText={touched.confirmPassword && errors.confirmPassword}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isSubmitting}
                        >
                            Créer
                        </Button>
                    </Box>
                </Container>
            )}
        </Formik>
    );
};
