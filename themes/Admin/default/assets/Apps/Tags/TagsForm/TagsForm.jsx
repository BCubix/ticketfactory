import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Button, FormHelperText, InputLabel } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

import { changeSlug } from '@Services/utils/changeSlug';

export const TagsForm = ({ handleSubmit, initialValues = null, translateInitialValues = null }) => {
    const initValues = translateInitialValues || initialValues;

    const tagSchema = Yup.object().shape({
        name: Yup.string().required('Veuillez renseigner le nom du tag.'),
    });

    return (
        <Formik
            initialValues={{
                name: initValues?.name || '',
                active: initValues?.active || false,
                description: initValues?.description || '',
                slug: initValues?.slug || '',
                lang: initValues?.lang?.id || '',
                languageGroup: initValues?.languageGroup || '',
                editSlug: false,
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
            validationSchema={tagSchema}
            onSubmit={async (values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, isSubmitting }) => (
                <Component.CmtPageWrapper title={`${initialValues ? 'Modification' : 'Création'} d'un tag`} component="form" onSubmit={handleSubmit}>
                    <Component.CmtFormBlock title="Informations générales">
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
                            sx={{ marginBottom: 2 }}
                            required
                        />
                        <Component.CmtSlugInput values={values} setFieldValue={setFieldValue} name="slug" />

                        <InputLabel id="description" sx={{ marginTop: 3 }}>
                            Description
                        </InputLabel>
                        <Component.LightEditorFormControl id="descriptionControl">
                            <Component.LightEditor
                                labelId="description"
                                value={values.description}
                                onBlur={() => setFieldTouched('description', true, false)}
                                onChange={(val) => {
                                    setFieldValue('description', val);
                                }}
                            />
                            <FormHelperText error>{touched.description && errors.description}</FormHelperText>
                        </Component.LightEditorFormControl>
                    </Component.CmtFormBlock>

                    <Component.SEOForm values={values} setFieldValue={setFieldValue} handleChange={handleChange} handleBlur={handleBlur} touched={touched} errors={errors} />

                    <Box display="flex" justifyContent={'flex-end'} sx={{ pt: 3, pb: 2 }}>
                        <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text="Tag actif ?" />

                        <Button type="submit" variant="contained" id="submitForm" disabled={isSubmitting}>
                            {initialValues ? 'Modifier' : 'Créer'}
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
