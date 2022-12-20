import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Box } from '@mui/system';
import { Button, FormHelperText } from '@mui/material';

import { Component } from '@/AdminService/Component';

export const PagesForm = ({ handleSubmit, initialValues = null }) => {
    const pageSchema = Yup.object().shape({
        title: Yup.string().required('Veuillez renseigner le titre de la page.').max(250, 'Le nom renseigné est trop long.'),
    });

    return (
        <Formik
            initialValues={{
                active: initialValues?.active || false,
                title: initialValues?.title || '',
                pageBlocks:
                    initialValues?.pageBlocks?.map((pageBlock) => ({
                        name: pageBlock.name,
                        saveAsModel: false,
                        columns: pageBlock?.columns?.map((column) => ({
                            content: column?.content,
                            xs: column?.xs || 12,
                            s: column?.s || 12,
                            m: column?.m || 12,
                            l: column?.l || 12,
                            xl: column?.xl || 12,
                        })),
                    })) || [],
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
                        <Component.PagesBlocksPart
                            values={values}
                            errors={errors}
                            touched={touched}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                        />

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
