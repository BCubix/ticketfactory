import React, { useMemo } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Button, FormHelperText } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

import ContentTypesModules from '@Apps/ContentTypes/ContentTypesForm/ContentTypeModules';

export const ContentTypesForm = ({ initialValues = null, submitForm }) => {
    const getContentTypesModules = useMemo(() => {
        return ContentTypesModules();
    }, []);

    const contentTypeSchema = Yup.object().shape({
        name: Yup.string().required('Veuillez renseigner le nom du type de contenus.'),
        fields: Yup.array()
            .of(
                Yup.object().shape({
                    title: Yup.string().required('Veuillez renseigner le titre de votre champ.'),
                    name: Yup.string().required('Veuillez renseigner le nom de votre champ.'),
                    type: Yup.string().required('Veuillez renseigner le type de votre champ.'),
                    parameters: Yup.array().of(
                        Yup.object().when('type', (type) => {
                            if (!type) {
                                return;
                            }

                            const moduleName = String(type).charAt(0).toUpperCase() + type?.slice(1) + CONTENT_TYPE_MODULES_EXTENSION;
                            if (getContentTypesModules[moduleName]?.getValidation) {
                                return Yup.object().shape({
                                    ...getContentTypesModules[moduleName].getValidation(),
                                });
                            }
                        })
                    ),
                })
            )
            .required('Veuillez renseigner un champ')
            .min(1, 'Veuillez renseigner au moins un type de champs'),
    });

    return (
        <Formik
            initialValues={{
                name: initialValues?.name || '',
                active: initialValues?.active || false,
                fields: initialValues?.fields || [],
            }}
            validationSchema={contentTypeSchema}
            onSubmit={async (values, { setSubmitting }) => {
                await submitForm(values);
                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, isSubmitting }) => (
                <Component.CmtPageWrapper component="form" onSubmit={handleSubmit} title={`${initialValues ? 'Modification' : 'Création'} d'un type de contenus`}>
                    <Component.CmtFormBlock title="Informations générales">
                        <Component.CmtTextField
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Nom du type de contenus"
                            name="name"
                            error={touched.name && errors.name}
                        />
                    </Component.CmtFormBlock>

                    <Component.CmtFormBlock title="Champs">
                        <Component.ContentTypeFieldArrayForm
                            contentTypesModules={getContentTypesModules}
                            values={values}
                            errors={errors}
                            touched={touched}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                        />

                        {errors?.fields && typeof errors?.fields === 'string' && (
                            <FormHelperText error id="fields-helper-text">
                                {errors.fields}
                            </FormHelperText>
                        )}
                    </Component.CmtFormBlock>

                    <Box display="flex" justifyContent="flex-end" sx={{ pt: 3, pb: 2 }}>
                        <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text="Type de contenu actif ?" />

                        <Button type="submit" variant="contained" disabled={isSubmitting} id="submitForm">
                            {initialValues ? 'Modifier' : 'Créer'}
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
