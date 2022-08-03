import { Button, Container, FormControlLabel, Switch, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';

export const SeasonsForm = ({ handleSubmit, initialValues = null }) => {
    const seasonsSchema = Yup.object().shape({
        name: Yup.string().required('Veuillez renseigner le nom de la saison.'),
        beginYear: Yup.number().required("Veuillez renseigner l'année de début."),
    });

    return (
        <Formik
            initialValues={
                initialValues
                    ? initialValues
                    : {
                          name: '',
                          active: false,
                          beginYear: '',
                      }
            }
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
                <Container maxWidth="sm">
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ margin: 5, display: 'flex', flexDirection: 'column' }}
                    >
                        <TextField
                            margin="normal"
                            size="small"
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            fullWidth
                            id="name"
                            label="Nom"
                            name="name"
                            autoComplete="name"
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                        />
                        <TextField
                            margin="normal"
                            size="small"
                            type="number"
                            value={values.beginYear}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            fullWidth
                            id="beginYear"
                            label="Année de début"
                            name="beginYear"
                            autoComplete="beginYear"
                            error={touched.beginYear && Boolean(errors.beginYear)}
                            helperText={touched.beginYear && errors.beginYear}
                        />
                        <FormControlLabel
                            sx={{ marginLeft: 'auto' }}
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
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isSubmitting}
                        >
                            {initialValues ? 'Modifier' : 'Créer'}
                        </Button>
                    </Box>
                </Container>
            )}
        </Formik>
    );
};
