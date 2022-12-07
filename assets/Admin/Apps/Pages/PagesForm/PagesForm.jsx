import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Box } from '@mui/system';
import { Button, FormControlLabel, FormHelperText, Switch } from '@mui/material';

import { Component } from '@/AdminService/Component';

export const PagesForm = ({ handleSubmit, initialValues = null }) => {
    const pageSchema = Yup.object().shape({
        title: Yup.string().required('Veuillez renseigner le titre de la page.').max(250, 'Le nom renseigné est trop long.'),
        pageBlocks: Yup.array().of(
            Yup.object().shape({
                content: Yup.string().required('Veuillez renseigner le contenu de votre bloc.'),
            })
        ),
    });

    return (
        <Formik
            initialValues={{
                active: initialValues?.active || false,
                title: initialValues?.title || '',
                pageBlocks: initialValues?.pageBlocks || [],
            }}
            validationSchema={pageSchema}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, isSubmitting }) => (
                <Component.CmtPageWrapper component="form" onSubmit={handleSubmit} title={`${initialValues ? 'Modification' : 'Création'} d'une page`}>
                    <Component.CmtFormBlock title="Informations générales">
                        <Component.CmtTextField
                            value={values.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Titre de la page"
                            name="title"
                            error={touched.title && errors.title}
                        />
                    </Component.CmtFormBlock>

                    <Component.CmtFormBlock title="Blocs">
                        <Component.PagesBlocksForm values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />

                        {errors?.pageBlocks && typeof errors?.pageBlocks === 'string' && <FormHelperText error>{errors.pageBlocks}</FormHelperText>}
                    </Component.CmtFormBlock>
                    <Box display="flex" justifyContent="flex-end" sx={{ pt: 3, pb: 2 }}>
                        <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text="Page active ?" />

                        <Button type="submit" variant="contained" id="submitForm" disabled={isSubmitting}>
                            {initialValues ? 'Modifier' : 'Créer'}
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
