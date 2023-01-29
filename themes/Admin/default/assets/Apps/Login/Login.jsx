import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Avatar, Box, Button, Checkbox, FormControlLabel, Grid, Link, Paper, Typography } from '@mui/material';

import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { loginAction, profileSelector } from '@Redux/profile/profileSlice';

export const Login = () => {
    const dispatch = useDispatch();
    const { connected } = useSelector(profileSelector);
    const navigate = useNavigate();

    useEffect(() => {
        if (connected) {
            navigate(Constant.HOME_PATH);
        }
    }, [connected]);

    const loginSchema = Yup.object().shape({
        username: Yup.string().required('Veuillez renseigner une adresse email.').email('Adresse email invalide.'),
        password: Yup.string().required('Veuillez renseigner votre mot de passe.'),
    });

    return (
        <Component.LoginPageWrapper component="main">
            <Box
                sx={{
                    zIndex: 100,
                    display: { xs: 'none', md: 'block' },
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: { md: '32vh', lg: '35vh' },
                    height: 5,
                    backgroundColor: (theme) => theme.palette.secondary.main,
                }}
            />
            <Component.LoginComponentWrapper>
                <Formik
                    initialValues={{ username: '', password: '' }}
                    validationSchema={loginSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        await dispatch(loginAction(values));
                        setSubmitting(false);
                    }}
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                        <Box
                            sx={{
                                width: '100%',
                                marginInline: { xs: 'auto', sm: 0 },
                            }}
                            component="form"
                            onSubmit={handleSubmit}
                        >
                            <Box sx={{ height: '20vh', width: '100%' }}>
                                <Box component="img" src={Constant.LOGOS_FILE_PATH + Constant.LOGIN_LOGOS_FILE} width="100%" maxWidth={150} />
                                <Typography
                                    component="h1"
                                    variant="h1"
                                    sx={{ textTransform: 'uppercase', fontSize: 45, fontWeight: 800, marginTop: { xs: 5, md: 20 }, letterSpacing: '-0.025em' }}
                                >
                                    Connexion
                                </Typography>
                            </Box>
                            <Box sx={{ mt: { xs: 5, md: 25 } }} fullWidth>
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
                                <Component.CmtTextField
                                    margin="normal"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    fullWidth
                                    name="password"
                                    label="Mot de passe"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    error={touched.password && Boolean(errors.password)}
                                    helperText={touched.password && errors.password}
                                />
                                <Box sx={{ marginTop: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Link
                                        href={Constant.FORGOT_PASSWORD_PATH}
                                        variant="body2"
                                        sx={{
                                            color: (theme) => theme.palette.tertiary.main,
                                            textDecoration: 'none',
                                            '&:hover': {
                                                color: (theme) => theme.palette.tertiary.main,
                                            },
                                        }}
                                    >
                                        Mot de passe oublié
                                    </Link>
                                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                                        Se connecter
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Formik>
            </Component.LoginComponentWrapper>
            <Component.LoginBackgroundWrapper backgroundUrl={Constant.IMAGES_FILE_PATH + Constant.LOGIN_BACKGROUND_FILE}>
                <Box sx={{ zIndex: 20, height: '20vh', width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                    <Typography
                        component="h2"
                        variant="h1"
                        sx={{ color: '#FFFFFF', textTransform: 'uppercase', fontSize: 45, fontWeight: 800, marginTop: { xs: 5, md: 20 }, letterSpacing: '-0.025em' }}
                    >
                        Bienvenue
                    </Typography>
                </Box>

                <Box sx={{ zIndex: 20, mt: { md: 25 }, color: '#FFFFFF', maxWidth: { md: '30vw', lg: '20vw' } }}>
                    <Typography variant="h1" sx={{ color: '#FFFFFF', textTransform: 'uppercase', fontSize: 25, fontWeight: 500, marginTop: { xs: 5, md: 20 } }}>
                        Titre
                    </Typography>

                    <Typography sx={{ marginTop: 3, fontSize: 18 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: 18 }} component="b">
                            Lorem ipsum{' '}
                        </Typography>
                        dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                    </Typography>
                </Box>
            </Component.LoginBackgroundWrapper>
        </Component.LoginPageWrapper>
    );
};
