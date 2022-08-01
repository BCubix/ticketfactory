import { Button, Container, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import React from 'react';

export const CreateUser = () => {
    const handleSubmit = (data) => {};

    const checkErrors = (values) => {
        const errors = {};

        if (!values.firstName) {
            errors.firstName = 'Veuillez renseigner le prénom.';
        }

        if (!values.lastName) {
            errors.lastName = 'Veuillez renseigner le nom.';
        }

        if (!values.email) {
            errors.email = "Veuillez renseigner l'adresse email.";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = 'Adresse email invalide';
        }

        if (!values.password) {
            errors.password = 'Veuillez renseigner le mot de passe.';
        }

        if (!values.confirmPassword) {
            errors.confirmPassword = 'Veuillez confirmer le mot de passe.';
        } else if (values.confirmPassword !== values.password) {
            errors.confirmPassword = 'Le mot de passe ne correspond pas.';
        }
    };

    return (
        <Formik
            initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
            }}
            validate={(values) => checkErrors(values)}
            onSubmit={async (values, { setSubmitting }) => {
                console.log(values);
                // Call to create user
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
                <Container sm>
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
