import React from 'react';
import slugify from 'react-slugify';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Button, Grid, } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

export const ImageFormatForm = ({ handleSubmit, initialValues = null }) => {
    const imageFormatSchema = Yup.object().shape({
        name: Yup.string().required('Veuillez renseigner le nom du format.').max(250, 'Le nom renseigné est trop long.'),
        slug: Yup.string().required('Veuillez renseigner le slug du format.').max(250, 'Le slug renseigné est trop long.'),
        width: Yup.number().required('Veuillez renseigner la largeur du format.').min(1, 'Veuillez renseigner une largeur valide.'),
        height: Yup.number().required('Veuillez renseigner la hauteur du format.').min(1, 'Veuillez renseigner une hauteur valide.'),
    });

    return (
        <Formik
            initialValues={{
                name: initialValues?.name || '',
                slug: initialValues?.slug || '',
                active: initialValues?.active || false,
                width: initialValues?.width || '',
                height: initialValues?.height || '',
                themeUse: initialValues?.themeUse || false,
            }}
            validationSchema={imageFormatSchema}
            onSubmit={async (values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
                <Component.CmtPageWrapper title={`${initialValues ? 'Modification' : 'Création'} d'un format`} component={'form'} onSubmit={handleSubmit}>
                    <Component.CmtFormBlock title="Informations générales">
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6}>
                                <Component.CmtTextField
                                    value={values.name}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setFieldValue('slug', slugify(e.target.value));
                                    }}
                                    onBlur={handleBlur}
                                    label="Nom du type d'image"
                                    name="name"
                                    error={touched.name && errors.name}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Component.CmtTextField
                                    value={values.slug}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Slug du type d'image"
                                    name="slug"
                                    error={touched.slug && errors.slug}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Component.CmtTextField
                                    value={values.width}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Largeur"
                                    name="width"
                                    error={touched.width && errors.width}
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

                    <Box display="flex" justifyContent={'flex-end'} sx={{ pt: 3, pb: 2 }}>
                        <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text="Format d'image actif ?" />

                        <Button type="submit" variant="contained" disabled={isSubmitting} id="submitForm">
                            {initialValues ? 'Modifier' : 'Créer'}
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
