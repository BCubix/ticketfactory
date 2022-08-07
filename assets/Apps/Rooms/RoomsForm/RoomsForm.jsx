import { Button, FormControlLabel, Switch, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { RoomsMainPartForm } from './RoomsMainPartForm';
import { RoomsSeatingPlanPartForm } from './RoomsSeatingPlansPartForm';

export const RoomsForm = ({ handleSubmit, initialValues = null }) => {
    const roomsSchema = Yup.object().shape({
        name: Yup.string().required('Veuillez renseigner le nom de la salle.'),
    });

    return (
        <Formik
            initialValues={{
                name: initialValues?.name || '',
                active: initialValues?.active || false,
                seatsNb: initialValues?.seatsNb || '',
                area: initialValues?.area || '',
                seatingPlans: initialValues?.seatingPlans || [],
            }}
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
                <Box component="form" onSubmit={handleSubmit} sx={{ margin: 5 }}>
                    <Typography component="h1" variant={'h5'}>
                        {initialValues ? 'Modification' : 'Création'} d'une salle
                    </Typography>
                    <RoomsMainPartForm
                        values={values}
                        errors={errors}
                        touched={touched}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                    />

                    <RoomsSeatingPlanPartForm
                        values={values}
                        errors={errors}
                        touched={touched}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                    />

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
