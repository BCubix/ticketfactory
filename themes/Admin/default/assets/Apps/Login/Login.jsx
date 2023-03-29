import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Avatar, AvatarGroup, Box, Button, Checkbox, FormControlLabel, Grid, Link, Paper, Typography } from '@mui/material';

import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { loginAction, profileSelector } from '@Redux/profile/profileSlice';
import { Stack } from '@mui/system';

export const Login = () => {
    const dispatch = useDispatch();
    const { connected, modulesLoaded } = useSelector(profileSelector);
    const navigate = useNavigate();

    useEffect(() => {
        if (connected && modulesLoaded) {
            navigate(Constant.HOME_PATH);
        }
    }, [connected, modulesLoaded]);

    const loginSchema = Yup.object().shape({
        username: Yup.string().required('Veuillez renseigner une adresse email.').email('Adresse email invalide.'),
        password: Yup.string().required('Veuillez renseigner votre mot de passe.'),
    });

    return (
        <Component.LoginPageWrapper component="main">
            <Component.LoginComponentWrapper className="backgroundDot_vertical">
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
                            <Box sx={{ height: { xs: '15vh', md: '20vh', lg: '25vh' }, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <Box component="img" src={Constant.LOGOS_FILE_PATH + Constant.DEFAULT_LOGOS_FILE} width="100%" maxWidth={300} />
                                <Typography
                                    component="h1"
                                    variant="h1"
                                    sx={{
                                        textTransform: 'uppercase',
                                        fontSize: { xs: 25, md: 35, lg: 45 },
                                        fontWeight: 800,
                                        marginTop: { xs: 5, md: 20 },
                                        letterSpacing: '-0.025em',
                                    }}
                                >
                                    Connexion
                                </Typography>
                            </Box>
                            <Box sx={{ mt: { xs: 5, md: 25 }, width: '100%' }}>
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
                                <Box sx={{ marginTop: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
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
                <Box sx={{ zIndex: 20, height: { xs: '15vh', md: '20vh', lg: '25vh' }, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                    <Typography
                        component="h2"
                        variant="h1"
                        sx={{
                            color: '#FFFFFF',
                            textTransform: 'uppercase',
                            fontSize: { md: 35, lg: 45 },
                            fontWeight: 800,
                            marginTop: { xs: 5, md: 20 },
                            letterSpacing: '-0.025em',
                        }}
                    >
                        Bienvenue sur Ticket Factory
                    </Typography>
                </Box>

                <Box sx={{ zIndex: 20, mt: { md: 25 }, color: '#FFFFFF', maxWidth: { md: '30vw', lg: '40vw' } }}>
                    <Typography sx={{ marginTop: 3, fontSize: 18 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: 18 }} component="b">
                            Ticket Factory{' '}
                        </Typography>
                        est l'outil de
                        <Typography sx={{ fontWeight: 600, fontSize: 18 }} component="b">
                            {' '}
                            création de sites web{' '}
                        </Typography>
                        n°1 pour l'événementiel et la culture. Personnalisez votre site comme vous le souhaitez grâce aux
                        <Typography sx={{ fontWeight: 600, fontSize: 18 }} component="b">
                            {' '}
                            thèmes{' '}
                        </Typography>
                        disponibles pour votre domaine d'activité et communiquez avec le reste de votre écosystème digital grâce aux nombreux
                        <Typography sx={{ fontWeight: 600, fontSize: 18 }} component="b">
                            {' '}
                            modules{' '}
                        </Typography>
                        de la market place (liaisons billetterie, CRM, outils tiers)...{' '}
                    </Typography>

                    <Stack direction="row" spacing={10} sx={{ mt: 20 }}>
                        <LoginModulePresentation alt="Module 1">M1</LoginModulePresentation>
                        <LoginModulePresentation alt="Module 2">M2</LoginModulePresentation>
                        <LoginModulePresentation alt="Module 3">M3</LoginModulePresentation>
                        <LoginModulePresentation alt="Module 4">M4</LoginModulePresentation>
                        <LoginModulePresentation alt="Module 5">M5</LoginModulePresentation>
                        <LoginModulePresentation alt="Module 6">M6</LoginModulePresentation>
                    </Stack>

                    <Stack direction="row" spacing={10} sx={{ mt: 6 }}>
                        <LoginModulePresentation alt="Module 1">M1</LoginModulePresentation>
                        <LoginModulePresentation alt="Module 2">M2</LoginModulePresentation>
                        <LoginModulePresentation alt="Module 3">M3</LoginModulePresentation>
                        <LoginModulePresentation alt="Module 4">M4</LoginModulePresentation>
                        <LoginModulePresentation alt="Module 5">M5</LoginModulePresentation>
                        <LoginModulePresentation alt="Module 6">M6</LoginModulePresentation>
                    </Stack>
                </Box>
            </Component.LoginBackgroundWrapper>
        </Component.LoginPageWrapper>
    );
};

const LoginModulePresentation = ({ alt, children }) => {
    return (
        <Avatar alt={alt} sx={{ width: 64, height: 64 }}>
            {children}
        </Avatar>
    );
};
