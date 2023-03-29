import React, { useEffect } from 'react';
import { NotificationManager } from 'react-notifications';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Formik } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Avatar, Box, Button, Paper, Typography } from '@mui/material';
import { Container } from '@mui/system';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { profileSelector } from '@Redux/profile/profileSlice';

export const ChangePassword = () => {
    const { connected, modulesLoaded } = useSelector(profileSelector);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const dateTime = localStorage.getItem('forgotPasswordDate');

        if (!dateTime) {
            NotificationManager.error('Une erreur est survenu, Veuillez recommencer la procédure', 'Erreur', Constant.REDIRECTION_TIME);

            navigate(Constant.FORGOT_PASSWORD_PATH);
        } else if (moment().subtract(15, 'minutes').isAfter(moment(dateTime, 'x'))) {
            NotificationManager.error('Vous avez fait une demande il y a plus de 15 minutes, Veuillez recommencer la procédure', 'Erreur', Constant.REDIRECTION_TIME);

            navigate(Constant.FORGOT_PASSWORD_PATH);
        }

        if (!searchParams.get('token')) {
            NotificationManager.error('Le token est introuvable', 'Erreur', Constant.REDIRECTION_TIME);

            navigate(Constant.LOGIN_PATH);
            return;
        }

        if (!searchParams.get('email')) {
            NotificationManager.error("L'email est introuvable", 'Erreur', Constant.REDIRECTION_TIME);

            navigate(Constant.LOGIN_PATH);
            return;
        }
    }, []);

    useEffect(() => {
        if ((connected, modulesLoaded)) {
            navigate(Constant.HOME_PATH);
        }
    }, [connected]);

    const forgotPasswordSchema = Yup.object().shape({
        password: Yup.string()
            .min(10, 'Votre mot de passe doit contenir au moins 10 caractères.')
            .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{9,}$/,
                'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spéciale.'
            )
            .required('Veuillez renseigner un mot de passe.'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Le mot de passe ne correspond pas.'),
    });

    return (
        <Container component="main" maxWidth="xs" sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <Paper elevation={2} sx={{ borderRadius: 4 }}>
                <Formik
                    initialValues={{ password: '', confirmPassword: '' }}
                    validationSchema={forgotPasswordSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        const result = await Api.authApi.changePassword({
                            newPassword: values.password,
                            username: searchParams.get('email'),
                            token: searchParams.get('token'),
                        });
                        if (result.result) {
                            NotificationManager.success('Votre demande de changement de mot de passe a bien été prise en compte', 'Succès', Constant.REDIRECTION_TIME);

                            navigate(Constant.LOGIN_PATH);
                        } else {
                            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                        }

                        setSubmitting(false);
                    }}
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
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
                                Modifier le mot de passe
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                                <Component.CmtTextField
                                    value={values.password}
                                    type="password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Nouveau mot de passe"
                                    name="password"
                                    error={touched.password && errors.password}
                                    required
                                />
                                <Component.CmtTextField
                                    type="password"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Confirmer le nouveau mot de passe"
                                    name="confirmPassword"
                                    error={touched.confirmPassword && errors.confirmPassword}
                                    required
                                />
                                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, borderRadius: 5 }} disabled={isSubmitting}>
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
