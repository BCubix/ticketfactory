import React from 'react';
import { Button, Checkbox, FormControlLabel, Grid } from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Component } from '@/AdminService/Component';

export const LanguagesForm = ({ handleSubmit, initialValues = null }) => {
    const languageSchema = Yup.object().shape({
        name: Yup.string().required('Veuillez renseigner le nom de votre langue.'),
        isoCode: Yup.string().required("Veuillez renseigner l'identifiant de la nouvelle langue."),
    });

    return (
        <Formik
            initialValues={{
                name: initialValues?.name || '',
                isoCode: initialValues?.isoCode || '',
                locale: initialValues?.locale || '',
                datetimeFormat: initialValues?.datetimeFormat || '',
                dateFormat: initialValues?.dateFormat || '',
                timeFormat: initialValues?.timeFormat || '',
                isDefault: initialValues?.isDefault || false,
                active: initialValues?.active || false,
            }}
            validationSchema={languageSchema}
            onSubmit={async (values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
                <Component.CmtPageWrapper component="form" onSubmit={handleSubmit} title={`${initialValues ? 'Modification' : 'Création'} d'une langue`}>
                    <Component.CmtFormBlock title={'Informations générales'}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Component.CmtTextField
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Nom"
                                    name="name"
                                    error={touched.name && errors.name}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Component.CmtTextField
                                    value={values.isoCode}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Code ISO (FR, EN, ES, ...)"
                                    name="isoCode"
                                    error={touched.isoCode && errors.isoCode}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <Component.CmtTextField
                                    value={values.locale}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Locale"
                                    name="locale"
                                    error={touched.locale && errors.locale}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControlLabel
                                    size="small"
                                    id={`isDefault`}
                                    value={values.isDefault}
                                    onChange={(e) => {
                                        setFieldValue('isDefault', e.target.checked);
                                    }}
                                    label={'Langue par défault ?'}
                                    labelPlacement="start"
                                    control={<Checkbox checked={Boolean(values.isDefault)} />}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        marginLeft: 0,
                                        marginBlock: 0,
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Component.CmtFormBlock>

                    <Component.CmtFormBlock title={'Format des dates'}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6} l={4}>
                                <Component.CmtTextField
                                    value={values.datetimeFormat}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Date & Heure"
                                    name="datetimeFormat"
                                    error={touched.datetimeFormat && errors.datetimeFormat}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={3} l={4}>
                                <Component.CmtTextField
                                    value={values.dateFormat}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Date"
                                    name="dateFormat"
                                    error={touched.dateFormat && errors.dateFormat}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={3} l={4}>
                                <Component.CmtTextField
                                    value={values.timeFormat}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Heure"
                                    name="timeFormat"
                                    error={touched.timeFormat && errors.timeFormat}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </Component.CmtFormBlock>

                    <Box display="flex" justifyContent={'flex-end'} sx={{ pt: 3, pb: 2 }}>
                        <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text="Langue active ?" />

                        <Button type="submit" variant="contained" id="submitForm" disabled={isSubmitting}>
                            {initialValues ? 'Modifier' : 'Créer'}
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
