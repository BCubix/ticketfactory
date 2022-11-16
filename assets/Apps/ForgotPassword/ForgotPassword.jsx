import React, { useEffect } from 'react';
import { NotificationManager } from 'react-notifications';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Avatar, Box, Button, Paper, Typography } from '@mui/material';
import { Container } from '@mui/system';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { profileSelector } from '@Redux/profile/profileSlice';

export const ForgotPassword = () => {
    const { connected } = useSelector(profileSelector);
    const navigate = useNavigate();

    useEffect(() => {
        if (connected) {
            navigate(Constant.HOME_PATH);
        }
    }, [connected]);

    const forgotPasswordSchema = Yup.object().shape({
        username: Yup.string()
            .required('Veuillez renseigner une adresse email.')
            .email('Adresse email invalide.'),
    });

    return (
        <Container
            component="main"
            maxWidth="xs"
            sx={{ height: '100%', display: 'flex', alignItems: 'center' }}
        >
            <Paper elevation={2} sx={{ borderRadius: 4 }}>
                <Formik
                    initialValues={{ username: '' }}
                    validationSchema={forgotPasswordSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        const result = await Api.authApi.forgotPassword(values);
                        if (result.result) {
                            NotificationManager.success(
                                'Votre demande de changement de mot de passe a bien été prise en compte.',
                                'Succès',
                                Constant.REDIRECTION_TIME
                            );

                            navigate(Constant.LOGIN_PATH);
                        } else {
                            NotificationManager.error(
                                "Une erreur s'est produite",
                                'Erreur',
                                Constant.REDIRECTION_TIME
                            );
                        }

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
                        <Box
                            sx={{
                                margin: 5,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                            component="form"
                            onSubmit={handleSubmit}
                        >
                            <Avatar sx={{ m: 1, mb: 3, bgcolor: 'secondary.main' }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5" sx={{ fontWeight: 600 }}>
                                Mot de passe oublié
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                                <Component.CmtTextField
                                    margin="normal"
                                    value={values.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email"
                                    name="username"
                                    autoComplete="username"
                                    error={touched.username && Boolean(errors.username)}
                                    helperText={touched.username && errors.username}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2, borderRadius: 5 }}
                                    disabled={isSubmitting}
                                >
                                    Envoyer
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Formik>
            </Paper>
        </Container>
    );
};
