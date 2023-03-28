import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Button, FormControl, FormControlLabel, FormHelperText, Grid, InputLabel, ListItemText, ListSubheader, MenuItem, Select, Switch } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

export const RedirectionsForm = ({ handleSubmit, initialValues = null }) => {
    const redirectionSchema = Yup.object().shape({
        redirectType: Yup.string().required('Veuillez renseigner le type de redirection.'),
        redirectFrom: Yup.string()
            .required("Veuillez renseigner l'url à rediriger.")
            .max(1000, "l'url renseigné est trop longue.")
            .matches(/^(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/, 'Url invalide'),
        redirectTo: Yup.string()
            .required("Veuillez renseigner l'url de destination.")
            .max(1000, "l'url renseigné est trop longue.")
            .matches(/^(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/, 'Url invalide'),
    });

    return (
        <Formik
            initialValues={{
                active: initialValues?.active || false,
                redirectType: initialValues?.redirectType || '',
                redirectFrom: initialValues?.redirectFrom || '',
                redirectTo: initialValues?.redirectTo || '',
            }}
            validationSchema={redirectionSchema}
            onSubmit={async (values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
                <Component.CmtPageWrapper component="form" onSubmit={handleSubmit} title={`${initialValues ? 'Modification' : 'Création'} d'une redirection`}>
                    <Component.CmtFormBlock title="Informations générales">
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6} lg={4}>
                                <Component.CmtSelect
                                    label="Type de redirection"
                                    required
                                    id={`redirectType`}
                                    name={`redirectType`}
                                    value={values.redirectType}
                                    list={Constant.REDIRECTION_TYPES}
                                    getValue={(item) => item.value}
                                    getName={(item) => item.label}
                                    setFieldValue={setFieldValue}
                                    touched={touched.redirectType}
                                    errors={errors.redirectType}
                                />
                            </Grid>

                            <Grid item xs={12} md={6} lg={4}>
                                <Component.CmtTextField
                                    label="Rediriger"
                                    required
                                    name="redirectFrom"
                                    value={values.redirectFrom}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.redirectFrom && errors.redirectFrom}
                                />
                            </Grid>

                            <Grid item xs={12} md={6} lg={4}>
                                <Component.CmtTextField
                                    label="Vers"
                                    required
                                    name="redirectTo"
                                    value={values.redirectTo}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.redirectTo && errors.redirectTo}
                                />
                            </Grid>
                        </Grid>
                    </Component.CmtFormBlock>
                    <Box display="flex" justifyContent={'flex-end'} sx={{ mt: 3, mb: 2 }}>
                        <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text="Redirection active ?" />

                        <Button type="submit" variant="contained" disabled={isSubmitting} id="submitForm">
                            {initialValues ? 'Modifier' : 'Créer'}
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
