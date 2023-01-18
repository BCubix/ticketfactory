import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Button } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

import { changeSlug } from '@Services/utils/changeSlug';

export const CategoriesForm = ({ handleSubmit, initialValues = null, categoriesList = null, translateInitialValues = null }) => {
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
                parent: initValues?.parent?.id || '',
                mustHaveParent: !initValues || Boolean(initValues?.parent),
                slug: initValues?.slug || '',
                lang: initValues?.lang?.id || '',
                languageGroup: initValues?.languageGroup || '',
                editSlug: false,
            }}
            validationSchema={categorySchema}
            onSubmit={async (values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
                <Component.CmtPageWrapper component="form" onSubmit={handleSubmit} title={`${initialValues ? 'Modification' : 'Création'} d'une catégorie`}>
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
                            required
                        />
                        <Component.CmtSlugInput values={values} setFieldValue={setFieldValue} name="slug" />

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
