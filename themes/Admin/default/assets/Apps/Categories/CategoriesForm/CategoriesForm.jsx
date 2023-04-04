import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Button, Grid } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

import { changeSlug } from '@Services/utils/changeSlug';

export const CategoriesForm = ({ handleSubmit, parentId = null, initialValues = null, categoriesList = null, translateInitialValues = null }) => {
    const initValues = translateInitialValues || initialValues;

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
                name: initValues?.name || '',
                active: initValues?.active || false,
                parent: initValues?.parent?.id || parentId || '',
                mustHaveParent: !initValues || Boolean(initValues?.parent),
                slug: initValues?.slug || '',
                lang: initValues?.lang?.id || '',
                languageGroup: initValues?.languageGroup || '',
                keyword: initValues?.keyword || '',
                editSlug: false,
                editKeyword: false,
                seo: {
                    metaTitle: initValues?.metaTitle || '',
                    metaDescription: initValues?.metaDescription || '',
                    socialImage: initValues?.socialImage || null,
                    fbTitle: initValues?.fbTitle || '',
                    fbDescription: initValues?.fbDescription || '',
                    twTitle: initValues?.twTitle || '',
                    twDescription: initValues?.twDescription || '',
                },
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
                                <Component.CmtKeywordInput values={values} setFieldValue={setFieldValue} name="keyword" />
                            </Grid>

                            {values?.mustHaveParent && (
                                <Grid item xs={12}>
                                    <Component.ParentCategoryPartForm
                                        values={values}
                                        categoriesList={categoriesList}
                                        setFieldValue={setFieldValue}
                                        touched={touched}
                                        errors={errors}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </Component.CmtFormBlock>

                    <Component.SEOForm values={values} setFieldValue={setFieldValue} handleChange={handleChange} handleBlur={handleBlur} touched={touched} errors={errors} />

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
