import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Button } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

export const MediaDataForm = ({ media, mediaType, handleSubmit, deleteElement, mediaCategoriesList }) => {
    const mediaSchema = Yup.object().shape({
        title: Yup.string().required('Veuillez renseigner le titre du fichier'),
    });

    return (
        <Formik
            initialValues={{
                alt: media?.alt || '',
                title: media?.title || '',
                legend: media?.legend || '',
                description: media?.description || '',
                active: media?.active || false,
                mainCategory: media?.mainCategory?.id || '',
                mediaCategories: media?.mediaCategories ? media?.mediaCategories?.map((el) => el.id) : [],
            }}
            validationSchema={mediaSchema}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmit({ ...media, ...values });

                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
                <Box component="form" onSubmit={handleSubmit} sx={{ margin: 5 }}>
                    {mediaType === 'image' && (
                        <Component.CmtTextField
                            value={values.alt}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Texte alternatif"
                            name="alt"
                            error={touched.alt && errors.alt}
                        />
                    )}

                    <Component.CmtTextField
                        value={values.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Titre"
                        name="title"
                        error={touched.title && errors.title}
                        sx={{ mt: 10 }}
                        required
                    />

                    <Component.CmtTextField
                        value={values.legend}
                        multiline
                        rows={3}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Légende"
                        name="legend"
                        error={touched.legend && errors.legend}
                        sx={{ mt: 10 }}
                    />

                    <Component.CmtTextField
                        value={values.description}
                        multiline
                        rows={3}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Description"
                        name="description"
                        error={touched.description && errors.description}
                        sx={{ mt: 10 }}
                    />

                    <Component.MediaParentCategoryPartForm
                        sx={{ mt: 10 }}
                        values={values}
                        mediaCategoriesList={mediaCategoriesList}
                        setFieldValue={setFieldValue}
                        touched={touched}
                        errors={errors}
                    />

                    <Box display={'flex'} justifyContent="flex-end" sx={{ pb: 3, pt: 5 }}>
                        <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text="Média actif ?" mr={0} />
                    </Box>

                    <Box display="flex" justifyContent={'flex-end'} sx={{ mb: 5, mt: 2 }}>
                        <Button id="deleteButton" color="error" onClick={deleteElement} sx={{ mt: 3, mb: 2, mr: 'auto' }}>
                            Supprimer l'element
                        </Button>

                        <Button id="submitForm" type="submit" variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isSubmitting}>
                            Modifier
                        </Button>
                    </Box>
                </Box>
            )}
        </Formik>
    );
};
