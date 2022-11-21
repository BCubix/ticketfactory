import React from 'react';
import { Formik } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    FormHelperText,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';

import { Component } from "@/AdminService/Component";

const DAY_LIST = [
    { label: 'Lundi', value: 'lundi' },
    { label: 'Mardi', value: 'mardi' },
    { label: 'Mercredi', value: 'mercredi' },
    { label: 'Jeudi', value: 'jeudi' },
    { label: 'Vendredi', value: 'vendredi' },
    { label: 'Samedi', value: 'samedi' },
    { label: 'Dimanche', value: 'dimanche' },
];

export const EventDateRange = ({ open, setOpen, submitDateRange }) => {
    const handleGenerateDate = (values) => {
        let beginDate = moment(`${values.beginDate} ${values.hour}`, 'YYYY-MM-DD HH:mm');
        let endDate = moment(values.endDate);
        let generatedList = [];

        while (values.day !== beginDate.format('dddd')) {
            beginDate.add(1, 'day');
        }

        while (beginDate.isSameOrBefore(endDate, 'day')) {
            generatedList.push({
                eventDate: beginDate.format('YYYY-MM-DD HH:mm'),
                annotation: '',
                state: 'valid',
                reportDate: '',
            });

            beginDate.add(7, 'day');
        }

        submitDateRange(generatedList);
        setOpen(null);
    };

    const generateSchema = Yup.object().shape({
        day: Yup.string().required('Veuillez renseigner le jour de récurrence.'),
        beginDate: Yup.date()
            .required('Veuillez renseigner la date de début.')
            .test('isValid', 'Date invalide', (val) => val && moment(val).isValid()),
        endDate: Yup.date()
            .required('Veuillez renseigner la date de fin')
            .test('isValid', 'Date invalide', (val) => val && moment(val).isValid())
            .when(
                'beginDate',
                (beginDate, schema) =>
                    beginDate &&
                    schema.min(beginDate, 'La date de fin doit être supérieur à la date de début')
            ),
        hour: Yup.string().required("Veuillez renseigner l'heure de début"),
    });

    return (
        <Dialog maxWidth="sm" fullWidth open={Boolean(open !== null)} onClose={() => setOpen(null)}>
            <Formik
                initialValues={{
                    day: 'Monday',
                    beginDate: moment().format('YYYY-MM-DD'),
                    endDate: '',
                    hour: moment().format('HH:mm'),
                }}
                validationSchema={generateSchema}
                onSubmit={(values, { setSubmitting }) => {
                    handleGenerateDate(values);

                    setSubmitting(false);
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    setFieldTouched,
                    setFieldValue,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                }) => (
                    <Box component="form" onSubmit={handleSubmit}>
                        <DialogContent dividers sx={{ padding: 5 }}>
                            <Typography component="h1" variant="h4">
                                Générer des dates selon la règle:
                            </Typography>

                            <Box
                                className="flex"
                                flexWrap={'wrap'}
                                alignItems="center"
                                marginTop={5}
                            >
                                <Typography marginRight={5}>Tous les </Typography>

                                <FormControl sx={{ maxWidth: 100 }} fullWidth>
                                    <Select
                                        labelId={'day-choice-label'}
                                        variant={'standard'}
                                        size="small"
                                        value={values.day}
                                        onChange={(e) => setFieldValue('day', e.target.value)}
                                        onBlur={handleBlur}
                                        name="day"
                                        required
                                    >
                                        {DAY_LIST.map((item, dayIndex) => (
                                            <MenuItem key={dayIndex} value={item.value}>
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText error>
                                        {touched.day && errors.day}
                                    </FormHelperText>
                                </FormControl>

                                <Typography marginInline={5}> entre le </Typography>

                                <Component.CmtDatePicker
                                    fullWidth
                                    maxWidth={100}
                                    value={values.beginDate}
                                    setValue={(newValue) => {
                                        setFieldValue(
                                            'beginDate',
                                            moment(newValue).format('YYYY-MM-DD')
                                        );
                                    }}
                                    name="beginDate"
                                    onTouched={setFieldTouched}
                                    required
                                    disablePast
                                    inputSize="small"
                                    error={touched.beginDate && errors.beginDate}
                                />

                                <Typography marginInline={5}> et le </Typography>

                                <Component.CmtDatePicker
                                    fullWidth
                                    maxWidth={100}
                                    value={values.endDate}
                                    setValue={(newValue) => {
                                        setFieldValue(
                                            'endDate',
                                            moment(newValue).format('YYYY-MM-DD')
                                        );
                                    }}
                                    onTouched={setFieldTouched}
                                    name="endDate"
                                    required
                                    disablePast
                                    inputSize="small"
                                    error={touched.endDate && errors.endDate}
                                />

                                <Typography marginInline={5}> inclus à </Typography>

                                <Component.CmtTimePicker
                                    fullWidth
                                    maxWidth={50}
                                    value={values.hour}
                                    setValue={(newValue) => {
                                        setFieldValue('hour', moment(newValue).format('HH:mm'));
                                    }}
                                    name="hour"
                                    onTouched={setFieldTouched}
                                    required
                                    inputSize="small"
                                    error={touched.hour && errors.hour}
                                />
                            </Box>
                        </DialogContent>

                        <DialogActions>
                            <Box
                                width="100%"
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Button
                                    color="error"
                                    onClick={() => setOpen(false)}
                                    id="cancelDialog"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    color="primary"
                                    type="submit"
                                    id="validateDialog"
                                    disabled={isSubmitting}
                                >
                                    Générer
                                </Button>
                            </Box>
                        </DialogActions>
                    </Box>
                )}
            </Formik>
        </Dialog>
    );
};
