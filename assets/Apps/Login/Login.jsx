import {
    Avatar,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Link,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { Container } from '@mui/system';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Formik } from 'formik';
import { loginAction, profileSelector } from '@Redux/profile/profileSlice';
import { HOME_PATH } from '@/Constant';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

export const Login = () => {
    const dispatch = useDispatch();
    const { connected } = useSelector(profileSelector);
    const navigate = useNavigate();

    useEffect(() => {
        if (connected) {
            navigate(HOME_PATH);
        }
    }, [connected]);

    const loginSchema = Yup.object().shape({
        username: Yup.string()
            .required('Veuillez renseigner une adresse email.')
            .email('Adresse email invalide.'),
        password: Yup.string().required('Veuillez renseigner votre mot de passe.'),
    });

    return (
        <Container
            component="main"
            maxWidth="xs"
            sx={{ height: '100%', display: 'flex', alignItems: 'center' }}
        >
            <Paper elevation={2} sx={{ borderRadius: 4 }}>
                <Formik
                    initialValues={{ username: '', password: '' }}
                    validationSchema={loginSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        await dispatch(loginAction(values));
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
                                Sign in
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                                <TextField
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
                                <TextField
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
                                <Grid container>
                                    <Grid item xs>
                                        <FormControlLabel
                                            control={<Checkbox value="remember" color="primary" />}
                                            label="Remember me"
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end',
                                        }}
                                    >
                                        <Link href="#" variant="body2">
                                            Forgot password?
                                        </Link>
                                    </Grid>
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2, borderRadius: 5 }}
                                    disabled={isSubmitting}
                                >
                                    Se connecter
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Formik>
            </Paper>
        </Container>
    );
};
