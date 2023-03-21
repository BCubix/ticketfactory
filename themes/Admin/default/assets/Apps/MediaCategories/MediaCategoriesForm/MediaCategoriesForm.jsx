import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Button, Grid } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

import { changeSlug } from '@Services/utils/changeSlug';

export const MediaCategoriesForm = ({ handleSubmit, parentId = null, initialValues = null, mediaCategoriesList = null, translateInitialValues = null }) => {
    const initValues = translateInitialValues || initialValues;

    const mediaCategorySchema = Yup.object().shape({
        name: Yup.string().required('Veuillez renseigner le nom de la catégorie.'),
        parent: Yup.string().when('mustHaveParent', (mustHaveParent) => {
            if (mustHaveParent) {
                return Yup.string().required('Veuillez renseigner une catégorie parente.');
            }
        }),
    });

    if (!mediaCategoriesList) {
        return <></>;
    }

    return (
        <Formik
            initialValues={{
                id: initValues?.id || undefined,
                name: initValues?.name || '',
                shortDescription: initValues?.shortDescription || '',
                active: initValues?.active || false,
                parent: initValues?.parent?.id || parentId || '',
                mustHaveParent: !initValues || Boolean(initValues?.parent),
                slug: initValues?.slug || '',
                lang: initValues?.lang?.id || '',
                languageGroup: initValues?.languageGroup || '',
                editSlug: false,
            }}
            validationSchema={mediaCategorySchema}
            onSubmit={async (values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
                <Component.CmtPageWrapper component="form" onSubmit={handleSubmit} title={`${initialValues ? 'Modification' : 'Création'} d'une catégorie`}>
                    <Component.CmtFormBlock title="Informations générales">
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6}>
                                <Component.CmtTextField
                                    value={values.name}
                                    onChange={(e) => {
                                        setFieldValue('name', e.target.value);
                                        if (!values.editSlug && !initialValues) {
                                            setFieldValue('slug', changeSlug(e.target.value));
                                        }
                                    }}
                                    onBlur={handleBlur}
                                    label="Nom"
                                    name="name"
                                    error={touched.name && errors.name}
                                    required
                                />
                                <Component.CmtSlugInput values={values} setFieldValue={setFieldValue} name="slug" />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Component.CmtTextField
                                    value={values.shortDescription}
                                    onChange={(e) => {
                                        setFieldValue('shortDescription', e.target.value);
                                    }}
                                    onBlur={handleBlur}
                                    label="Description courte"
                                    name="name"
                                    error={touched.shortDescription && errors.shortDescription}
                                />
                            </Grid>

                            {values?.mustHaveParent && (
                                <Grid item xs={12}>
                                    <Component.ParentMediaCategoryPartForm
                                        values={values}
                                        mediaCategoriesList={mediaCategoriesList}
                                        setFieldValue={setFieldValue}
                                        touched={touched}
                                        errors={errors}
                                    />
                                </Grid>
                            )}
                        </Grid>
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
