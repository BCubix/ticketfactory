import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Button, Switch, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

export const CategoriesForm = ({ handleSubmit, initialValues = null, categoriesList = null }) => {
    const categorySchema = Yup.object().shape({
        name: Yup.string().required('Veuillez renseigner le nom de la categorie.'),
        parent: Yup.string().when('mustHaveParent', (mustHaveParent) => {
            if (mustHaveParent) {
                return Yup.string().required('Veuillez renseigner une catégorie parente.');
            }
        }),
    });

    if (!categoriesList) {
        return <></>;
    }

    return (
        <Formik
            initialValues={{
                name: initialValues?.name || '',
                active: initialValues?.active || false,
                parent: initialValues?.parent?.id || '',
                mustHaveParent: !initialValues || Boolean(initialValues?.parent),
            }}
            validationSchema={categorySchema}
            onSubmit={async (values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
                <Component.CmtPageWrapper component="form" onSubmit={handleSubmit} title={`${initialValues ? 'Modification' : 'Création'} d'une catégorie`}>
                    <Component.CmtFormBlock title="Informations générales">
                        <Component.CmtTextField
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Nom"
                            name="name"
                            error={touched.name && errors.name}
                            required
                        />

                        {values?.mustHaveParent && (
                            <Component.ParentCategoryPartForm values={values} categoriesList={categoriesList} setFieldValue={setFieldValue} touched={touched} errors={errors} />
                        )}
                    </Component.CmtFormBlock>

                    <Box display="flex" justifyContent={'flex-end'} alignItems="center" sx={{ pt: 3, pb: 2 }}>
                        <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text="Catégorie active ?" />
                        <Button type="submit" variant="contained" disabled={isSubmitting} id="submitForm">
                            {initialValues ? 'Modifier' : 'Créer'}
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
