import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Button, FormControlLabel, Grid, Switch } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from "@/AdminService/Component";

export const ImageFormatForm = ({ handleSubmit, initialValues = null }) => {
    const imageFormatSchema = Yup.object().shape({
        name: Yup.string()
            .required('Veuillez renseigner le nom du format.')
            .max(250, 'Le nom renseigné est trop long.'),
        length: Yup.number()
            .required('Veuillez renseigner la largeur du format.')
            .min(1, 'Veuillez renseigner une largeur valide.'),
        height: Yup.number()
            .required('Veuillez renseigner la hauteur du format.')
            .min(1, 'Veuillez renseigner une hauteur valide.'),
    });

    return (
        <Formik
            initialValues={{
                name: initialValues?.name || '',
                active: initialValues?.active || false,
                length: initialValues?.length || '',
                height: initialValues?.height || '',
            }}
            validationSchema={imageFormatSchema}
            onSubmit={async (values, { setSubmitting }) => {
                handleSubmit(values);
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
                setFieldValue,
                isSubmitting,
            }) => (
                <Component.CmtPageWrapper
                    title={`${initialValues ? 'Modification' : 'Création'} d'un format`}
                    component={'form'}
                    onSubmit={handleSubmit}
                >
                    <Component.CmtFormBlock title="Informations générales">
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <Component.CmtTextField
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Nom du type d'image"
                                    name="name"
                                    error={touched.name && errors.name}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Component.CmtTextField
                                    value={values.length}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Largeur"
                                    name="length"
                                    error={touched.length && errors.length}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Component.CmtTextField
                                    value={values.height}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Hauteur"
                                    name="height"
                                    error={touched.height && errors.height}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </Component.CmtFormBlock>

                    <Box display="flex" justifyContent={'flex-end'}>
                        <FormControlLabel
                            sx={{ marginRight: 2, marginTop: 1 }}
                            control={
                                <Switch
                                    checked={Boolean(values.active)}
                                    onChange={(e) => {
                                        setFieldValue('active', e.target.checked);
                                    }}
                                />
                            }
                            label={'Activé ?'}
                            labelPlacement="start"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isSubmitting}
                        >
                            {initialValues ? 'Modifier' : 'Créer'}
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
