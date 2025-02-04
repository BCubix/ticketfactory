import React, { useCallback } from 'react';
import { Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Component } from '@/AdminService/Component';

export const EventDateAdd = React.memo(({ open, setOpen, index, submitDateRange, currentDate, data }) => {
    const generateSchema = Yup.object().shape({
        eventDate: Yup.string().required('Veuillez renseigner la date.'),
        state: Yup.string().required('Veuillez renseigner le status de cette date.'),
        reportDate: Yup.string().when('state', (state) => {
            if (state === 'delayed') {
                return Yup.string().required('Veuillez renseigner la nouvelle date.');
            } else {
                return Yup.string().nullable();
            }
        }),
    });

    const handleDateChange = useCallback((newValue, setFieldValue) => {
        setFieldValue('eventDate', moment(newValue).format('YYYY-MM-DD HH:mm'));
    }, []);

    const handleAddHour = useCallback(
        (setFieldValue) => {
            setFieldValue('hours', [...values.hours, moment().format('HH:mm')]);
        },
        [values]
    );

    return (
        <Dialog maxWidth="sm" fullWidth open={open} onClose={() => setOpen(null)}>
            <Formik
                initialValues={{
                    eventDate: data?.eventDate || currentDate,
                    state: data?.state || 'valid',
                    reportDate: data?.reportDate || '',
                    index: data?.index || index.current,
                }}
                validationSchema={generateSchema}
                onSubmit={(value, { setSubmitting }) => {
                    submitDateRange(value);
                    setSubmitting(false);
                }}
            >
                {({ values, errors, touched, setFieldTouched, setFieldValue, handleBlur, handleSubmit, isSubmitting }) => (
                    <Box component="form" onSubmit={handleSubmit}>
                        <DialogContent dividers padding={5}>
                            <Typography component="h1" variant="h4">
                                Ajouter ou modifier une date:
                            </Typography>

                            <Box className="flex wrap align-center margin-top-5">
                                <Typography marginInline={5}> Le </Typography>

                                <Component.CmtDatePicker
                                    fullWidth
                                    maxWidth={100}
                                    value={values.eventDate}
                                    setValue={(newValue) => handleDateChange(newValue, setFieldValue)}
                                    name="eventDate"
                                    onTouched={setFieldTouched}
                                    required
                                    inputSize="small"
                                    error={touched.eventDate && errors.eventDate}
                                />

                                <Typography marginInline={5}> inclus à </Typography>
                            </Box>

                            <Box className="flex row-end">
                                <Button color="primary" onClick={() => handleAddHour(setFieldValue)}>
                                    Ajouter une heure
                                </Button>
                            </Box>
                        </DialogContent>

                        <DialogActions>
                            <Box className="flex row-between align-center fullwidth">
                                <Button color="error" onClick={() => setOpen(null)} id="cancelDialog">
                                    Annuler
                                </Button>
                                <Button color="primary" type="submit" id="validateDialog" disabled={isSubmitting}>
                                    Générer
                                </Button>
                            </Box>
                        </DialogActions>
                    </Box>
                )}
            </Formik>
        </Dialog>
    );
});
