import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Button, FormControlLabel, Switch } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

export const RoomsForm = ({ handleSubmit, initialValues = null, translateInitialValues = null }) => {
    const initValues = translateInitialValues || initialValues;

    const roomsSchema = Yup.object().shape({
        name: Yup.string().required('Veuillez renseigner le nom de la salle.').max(250, 'Le nom renseigné est trop long.'),
        seatsNb: Yup.number().required('Veuillez renseigner le nombre de place.').min(1, 'Veuillez renseigner un nombre valide.'),
        area: Yup.number().required('Veuillez renseigner la superficie.').min(1, 'Veuillez renseigner un nombre valide.'),
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
                seatingPlans: initValues?.seatingPlans || [],
                slug: initValues?.slug || '',
                lang: translateInitialValues?.lang || initValues?.lang?.id || '',
                languageGroup: initValues?.languageGroup || '',
                editSlug: false,
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

                    <Component.RoomsSeatingPlanPartForm values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />

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
