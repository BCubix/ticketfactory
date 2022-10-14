import { Avatar, Box, Button, Paper, Typography } from '@mui/material';
import { Container } from '@mui/system';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Formik } from 'formik';
import { profileSelector } from '@Redux/profile/profileSlice';
import { HOME_PATH } from '@/Constant';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import authApi from '../../services/api/authApi';
import { LOGIN_PATH, REDIRECTION_TIME } from '../../Constant';
import { CmtTextField } from '../../Components/CmtTextField/CmtTextField';
import { NotificationManager } from 'react-notifications';

export const ForgotPassword = () => {
    const { connected } = useSelector(profileSelector);
    const navigate = useNavigate();

    useEffect(() => {
        if (connected) {
            navigate(HOME_PATH);
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
                        const result = await authApi.forgotPassword(values);
                        if (result.result) {
                            NotificationManager.success(
                                'Votre demande de changement de mot de passe à bien été prise en compte.',
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
                                Mot de passe oublié
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                                <CmtTextField
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
