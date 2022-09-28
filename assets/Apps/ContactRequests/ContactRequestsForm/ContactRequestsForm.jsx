import { Button, FormControlLabel, Grid, Switch, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { CmtFormBlock } from '../../../Components/CmtFormBlock/CmtFormBlock';
import { CmtPageWrapper } from '../../../Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { CmtTextField } from '../../../Components/CmtTextField/CmtTextField';

export const ContactRequestsForm = ({ handleSubmit, initialValues = null }) => {
    const contactRequestSchema = Yup.object().shape({
        firstName: Yup.string().required('Veuillez renseigner le prénom.'),
        lastName: Yup.string().required('Veuillez renseigner le nom.'),
        email: Yup.string()
            .required("Veuillez renseigner l'adresse email.")
            .email('Email invalide'),
        phone: Yup.string()
            .required('Veuillez renseigner le numéro de téléphone.')
            .matches(
                /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
                'Le numéro est invalide.'
            ),
        subject: Yup.string().required("Veuillez renseigner l'object de la demande."),
        message: Yup.string().required('Veuillez renseigner le message.'),
    });

    return (
        <Formik
            initialValues={{
                active: initialValues?.active || false,
                firstName: initialValues?.firstName || '',
                lastName: initialValues?.lastName || '',
                email: initialValues?.email || '',
                phone: initialValues?.phone || '',
                subject: initialValues?.subject || '',
                message: initialValues?.firstName || '',
            }}
            validationSchema={contactRequestSchema}
            onSubmit={async (values, { setSubmitting }) => {
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
                isSubmitting,
            }) => (
                <CmtPageWrapper
                    component="form"
                    onSubmit={handleSubmit}
                    title={`${
                        initialValues ? 'Modification' : 'Création'
                    } d'une demande de contact`}
                >
                    <CmtFormBlock title="Informations générales">
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <CmtTextField
                                    value={values.firstName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label={'Prénom'}
                                    name="firstName"
                                    error={touched.firstName && errors.firstName}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <CmtTextField
                                    value={values.lastName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label={'Nom'}
                                    name="lastName"
                                    error={touched.lastName && errors.lastName}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <CmtTextField
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label={'Email'}
                                    name="email"
                                    error={touched.email && errors.email}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <CmtTextField
                                    value={values.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label={'Numéro de téléphone'}
                                    name="phone"
                                    error={touched.phone && errors.phone}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CmtTextField
                                    value={values.subject}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label={'Objet'}
                                    name="subject"
                                    error={touched.subject && errors.subject}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CmtTextField
                                    value={values.message}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label={'Message'}
                                    name="message"
                                    error={touched.message && errors.message}
                                    multiline
                                    rows={5}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </CmtFormBlock>
                    <Box display="flex" justifyContent={'flex-end'}>
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
                </CmtPageWrapper>
            )}
        </Formik>
    );
};
