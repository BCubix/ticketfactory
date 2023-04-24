import React from 'react';
import { Formik } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';

import { Button, FormControlLabel, Grid, Switch } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from "@/AdminService/Component";

export const InfosForm = ({ handleSubmit, initialValues = null }) => {
    const infosSchema = Yup.object().shape({
        title: Yup.string()
            .required('Veuillez renseigner le titre de l\'information.')
            .max(250, 'Le nom renseigné est trop long.'),
        description: Yup.string().required('Veuillez renseigner le contenu de l\'information.'),
        url: Yup.string().max(250, 'L\'URL renseignée est trop longue.')
    });

    return (
        <Formik
            initialValues={{
                active: initialValues?.active || false,
                title: initialValues?.title || '',
                description: initialValues?.description || '',
                url: initialValues?.url || '',
                beginDate: initialValues?.beginDate || '',
                endDate: initialValues?.endDate || '',
            }}
            validationSchema={infosSchema}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
        >
            {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                  setFieldTouched,
                  isSubmitting,
              }) => (
                <Component.CmtPageWrapper
                    component="form"
                    onSubmit={handleSubmit}
                    title={`${initialValues ? 'Modification' : 'Création'} d'une information`}
                >
                    <Component.CmtFormBlock title="Informations générales">
                        <Component.CmtTextField
                            value={values.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Titre de l'information"
                            name="title"
                            error={touched.title && errors.title}
                            required
                        />

                        <Component.CmtTextField
                            value={values.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Description de l'information"
                            name="description"
                            error={touched.description && errors.description}
                            multiline
                            rows={4}
                            required
                        />

                        <Component.CmtTextField
                            value={values.url}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="URL de l'information"
                            name="url"
                            error={touched.url && errors.url}
                            required
                        />

                        <Grid container spacing={4} mt={3}>
                            <Grid item xs={12} sm={6}>
                                <Component.CmtDatePicker
                                    fullWidth
                                    value={values.beginDate}
                                    label="Date de début"
                                    setValue={(value) => {
                                        setFieldValue(
                                            'beginDate',
                                            value ? moment(value).format('YYYY-MM-DD HH:mm') : ''
                                        );
                                    }}
                                    onTouched={setFieldTouched}
                                    name={`beginDate`}
                                    error={touched.beginDate && errors.beginDate}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Component.CmtDatePicker
                                    fullWidth
                                    value={values.endDate}
                                    label="Date de début"
                                    setValue={(value) => {
                                        setFieldValue(
                                            'endDate',
                                            value ? moment(value).format('YYYY-MM-DD HH:mm') : ''
                                        );
                                    }}
                                    onTouched={setFieldTouched}
                                    name={`endDate`}
                                    error={touched.endDate && errors.endDate}
                                />
                            </Grid>
                        </Grid>
                    </Component.CmtFormBlock>

                    <Box display="flex" justifyContent="flex-end">
                        <FormControlLabel
                            sx={{ marginRight: 2, marginTop: 1 }}
                            control={
                                <Switch
                                    checked={Boolean(values.active)}
                                    onChange={(e) => {
                                        setFieldValue('active', e.target.checked);
                                    }}
                                />
                            }
                            label={'Activé ?'}
                            labelPlacement="start"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isSubmitting}
                        >
                            {initialValues ? 'Modifier' : 'Créer'}
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
}

export default { InfosForm };
