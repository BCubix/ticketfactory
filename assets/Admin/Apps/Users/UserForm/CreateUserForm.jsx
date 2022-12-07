import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Button, FormControl, FormControlLabel, FormHelperText, Grid, InputLabel, ListItemText, MenuItem, Select, Switch } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';
import { Constant } from '../../../AdminService/Constant';

export const CreateUserForm = ({ handleSubmit }) => {
    const userSchema = Yup.object().shape({
        firstName: Yup.string().required('Veuillez renseigner le prénom.'),
        lastName: Yup.string().required('Veuillez renseigner le nom.'),
        email: Yup.string().email('Email invalide.').required("Veuillez renseigner l'adresse email."),
        password: Yup.string()
            .min(10, 'Votre mot de passe doit contenir au moins 10 caractères.')
            .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{9,}$/,
                'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spéciale.'
            )
            .required('Veuillez renseigner un mot de passe.'),
        confirmPassword: Yup.string().when('password', (password) => {
            if (password) {
                return Yup.string()
                    .oneOf([Yup.ref('password')], 'Le mot de passe ne correspond pas.')
                    .required('Veuillez confirmer le mot de passe.');
            }
        }),
        roles: Yup.string().required('Veuillez renseigner le rôle de cet utilisateur.'),
    });

    return (
        <Formik
            initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                roles: '',
                password: '',
                confirmPassword: '',
                active: false,
            }}
            validationSchema={userSchema}
            onSubmit={async (values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, setFieldValue, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                <Component.CmtPageWrapper title={"Création d'un utilisateur"} component="form" onSubmit={handleSubmit}>
                    <Component.CmtFormBlock title={'Informations générales'}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6}>
                                <Component.CmtTextField
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Email"
                                    name="email"
                                    error={touched.email && errors.email}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth sx={{ marginTop: 2 }}>
                                    <InputLabel id="userRolesLabel" size="small" className="required-input">
                                        Rôles
                                    </InputLabel>
                                    <Select
                                        labelId="userRolesLabel"
                                        size="small"
                                        variant="standard"
                                        id="roles"
                                        value={values.roles}
                                        onBlur={handleBlur}
                                        name="roles"
                                        label="Rôles"
                                        onChange={(e) => {
                                            setFieldValue('roles', e.target.value);
                                        }}
                                    >
                                        {Constant.USER_ROLES.map((item, index) => (
                                            <MenuItem value={item.value} key={index} id={`userRolesValue-${item.value}`}>
                                                <ListItemText>{item.label}</ListItemText>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {touched.roles && errors.roles && <FormHelperText error>{errors.roles}</FormHelperText>}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Component.CmtTextField
                                    value={values.firstName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Prénom"
                                    name="firstName"
                                    error={touched.firstName && errors.firstName}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Component.CmtTextField
                                    value={values.lastName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Nom"
                                    name="lastName"
                                    error={touched.lastName && errors.lastName}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </Component.CmtFormBlock>

                    <Component.CmtFormBlock title="Sécurité">
                        <Component.CmtTextField
                            value={values.password}
                            type="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Mot de passe"
                            name="password"
                            error={touched.password && errors.password}
                            required
                        />
                        <Component.CmtTextField
                            type="password"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Confirmer le mot de passe"
                            name="confirmPassword"
                            error={touched.confirmPassword && errors.confirmPassword}
                            required
                        />
                    </Component.CmtFormBlock>
                    <Box display="flex" justifyContent={'flex-end'} sx={{ pt: 3, pb: 2 }}>
                        <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text="Utilisateur actif ?" />

                        <Button type="submit" variant="contained" disabled={isSubmitting}>
                            Créer
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
