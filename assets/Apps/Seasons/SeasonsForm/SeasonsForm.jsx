import { Button, FormControlLabel, Grid, Switch } from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { CmtFormBlock } from '../../../Components/CmtFormBlock/CmtFormBlock';
import { CmtTextField } from '../../../Components/CmtTextField/CmtTextField';

export const SeasonsForm = ({ handleSubmit, initialValues = null }) => {
    const seasonsSchema = Yup.object().shape({
        name: Yup.string().required('Veuillez renseigner le nom de la saison.'),
        beginYear: Yup.number().required("Veuillez renseigner l'année de début."),
    });

    return (
        <Formik
            initialValues={{
                name: initialValues?.name || '',
                active: initialValues?.active || false,
                beginYear: initialValues?.beginYear || '',
            }}
            validationSchema={seasonsSchema}
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
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ margin: 5, display: 'flex', flexDirection: 'column' }}
                >
                    <CmtFormBlock title={'Informations générales'}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <CmtTextField
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Nom"
                                    name="name"
                                    error={touched.name && errors.name}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <CmtTextField
                                    type="number"
                                    value={values.beginYear}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Année de début"
                                    name="beginYear"
                                    error={touched.beginYear && errors.beginYear}
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
                </Box>
            )}
        </Formik>
    );
};
