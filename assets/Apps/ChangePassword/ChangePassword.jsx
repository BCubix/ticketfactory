import { Avatar, Box, Button, Paper, Typography } from '@mui/material';
import { Container } from '@mui/system';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Formik } from 'formik';
import { profileSelector } from '@Redux/profile/profileSlice';
import { HOME_PATH } from '@/Constant';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';
import authApi from '../../services/api/authApi';
import { FORGOT_PASSWORD_PATH, LOGIN_PATH, REDIRECTION_TIME } from '../../Constant';
import { CmtTextField } from '../../Components/CmtTextField/CmtTextField';
import { NotificationManager } from 'react-notifications';
import moment from 'moment';

export const ChangePassword = () => {
    const { connected } = useSelector(profileSelector);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const dateTime = localStorage.getItem('forgotPasswordDate');

        if (!dateTime) {
            NotificationManager.error(
                'Une erreur est survenu, Veuillez recommencer la procédure',
                'Erreur',
                REDIRECTION_TIME
            );

            navigate(FORGOT_PASSWORD_PATH);
        } else if (moment().subtract(15, 'minutes').isAfter(moment(dateTime, 'x'))) {
            NotificationManager.error(
                'Vous avez fait une demande il y a plus de 15 minutes, Veuillez recommencer la procédure',
                'Erreur',
                REDIRECTION_TIME
            );

            navigate(FORGOT_PASSWORD_PATH);
        }

        if (!searchParams.get('token')) {
            NotificationManager.error('Le token est introuvable', 'Erreur', REDIRECTION_TIME);

            navigate(LOGIN_PATH);
            return;
        }

        if (!searchParams.get('email')) {
            NotificationManager.error("L'email est introuvable", 'Erreur', REDIRECTION_TIME);

            navigate(LOGIN_PATH);
            return;
        }
    }, []);

    useEffect(() => {
        if (connected) {
            navigate(HOME_PATH);
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
        confirmPassword: Yup.string().oneOf(
            [Yup.ref('password')],
            'Le mot de passe ne correspond pas.'
        ),
    });

    return (
        <Container
            component="main"
            maxWidth="xs"
            sx={{ height: '100%', display: 'flex', alignItems: 'center' }}
        >
            <Paper elevation={2} sx={{ borderRadius: 4 }}>
                <Formik
                    initialValues={{ password: '', confirmPassword: '' }}
                    validationSchema={forgotPasswordSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        const result = await authApi.changePassword({
                            newPassword: values.password,
                            username: searchParams.get('email'),
                            token: searchParams.get('token'),
                        });
                        if (result.result) {
                            NotificationManager.success(
                                'Votre demande de changement de mot de passe à bien été prise en compte',
                                'Succès',
                                REDIRECTION_TIME
                            );

                            navigate(LOGIN_PATH);
                        } else {
                            NotificationManager.error(
                                "Une erreur s'est produite",
                                'Erreur',
                                REDIRECTION_TIME
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
                                Modifier le mot de passe
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                                <CmtTextField
                                    value={values.password}
                                    type="password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Nouveau mot de passe"
                                    name="password"
                                    error={touched.password && errors.password}
                                    required
                                />
                                <CmtTextField
                                    type="password"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Confirmer le nouveau mot de passe"
                                    name="confirmPassword"
                                    error={touched.confirmPassword && errors.confirmPassword}
                                    required
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
