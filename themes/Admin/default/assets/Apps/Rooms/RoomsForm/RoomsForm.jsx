import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Button } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

export const RoomsForm = ({ handleSubmit, initialValues = null, translateInitialValues = null }) => {
    const initValues = translateInitialValues || initialValues;

    const roomsSchema = Yup.object().shape({
        name: Yup.string().required('Veuillez renseigner le nom de la salle.').max(250, 'Le nom renseigné est trop long.'),
        seatingPlans: Yup.array().of(
            Yup.object().shape({
                name: Yup.string().required('Veuillez renseigner le nom du plan'),
            })
        ),
    });

    return (
        <Formik
            initialValues={{
                name: initValues?.name || '',
                active: initValues?.active || false,
                seatsNb: initValues?.seatsNb || '',
                area: initValues?.area || '',
                seatingPlans:
                    initValues?.seatingPlans.map((el) => ({
                        ...el,
                        lang: el?.lang?.id || '',
                    })) || [],
                slug: initValues?.slug || '',
                languageGroup: initValues?.languageGroup || '',
                lang: initValues?.lang?.id || '',
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
            validationSchema={roomsSchema}
            onSubmit={async (values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
                <Component.CmtPageWrapper title={`${initialValues ? 'Modification' : 'Création'} d'une salle`} component="form" onSubmit={handleSubmit}>
                    <Component.RoomsMainPartForm
                        values={values}
                        errors={errors}
                        touched={touched}
                        setFieldValue={setFieldValue}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        editMode={Boolean(initialValues)}
                    />

                    <Component.RoomsSeatingPlanPartForm
                        values={values}
                        errors={errors}
                        touched={touched}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        setFieldValue={setFieldValue}
                    />

                    <Component.SEOForm values={values} setFieldValue={setFieldValue} handleChange={handleChange} handleBlur={handleBlur} touched={touched} errors={errors} />

                    <Box display="flex" justifyContent={'flex-end'} sx={{ pt: 3, pb: 2 }}>
                        <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text="Salle active ?" />

                        <Button type="submit" variant="contained" id="submitForm" disabled={isSubmitting}>
                            {initialValues ? 'Modifier' : 'Créer'}
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
