import { Button, Container, FormControlLabel, Switch, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';

export const RoomsForm = ({ handleSubmit, initialValues = null }) => {
    const roomsSchema = Yup.object().shape({
        name: Yup.string().required('Veuillez renseigner le nom de la salle.'),
    });

    return (
        <Formik
            initialValues={
                initialValues
                    ? initialValues
                    : {
                          name: '',
                          active: false,
                          seatsNb: '',
                          area: '',
                      }
            }
            validationSchema={roomsSchema}
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
                            value={values.seatsNb}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            fullWidth
                            id="seatsNb"
                            label="Nombre de places"
                            name="seatsNb"
                            error={touched.seatsNb && Boolean(errors.seatsNb)}
                            helperText={touched.seatsNb && errors.seatsNb}
                        />

                        <TextField
                            margin="normal"
                            size="small"
                            value={values.area}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            fullWidth
                            id="area"
                            label="Superficie"
                            name="area"
                            error={touched.area && Boolean(errors.area)}
                            helperText={touched.area && errors.area}
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
