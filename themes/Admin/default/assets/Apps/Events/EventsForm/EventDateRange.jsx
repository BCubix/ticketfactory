import React from 'react';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, FormHelperText, MenuItem, Select, Typography } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { v4 as uuidv4 } from 'uuid';
import DeleteIcon from '@mui/icons-material/Delete';
import { Component } from '@/AdminService/Component';

const DAY_LIST = [
    { label: 'Lundi', value: 'lundi' },
    { label: 'Mardi', value: 'mardi' },
    { label: 'Mercredi', value: 'mercredi' },
    { label: 'Jeudi', value: 'jeudi' },
    { label: 'Vendredi', value: 'vendredi' },
    { label: 'Samedi', value: 'samedi' },
    { label: 'Dimanche', value: 'dimanche' },
];

export const EventDateRange = ({ open, setOpen, index, submitDateRange }) => {
    const handleGenerateDate = (values) => {
        let beginDate = moment(values.beginDate, 'YYYY-MM-DD');
        let endDate = moment(values.endDate, 'YYYY-MM-DD');
        let generatedList = [];

        while (beginDate.isSameOrBefore(endDate, 'day')) {
            if (values.days.indexOf(beginDate.format('dddd').toLowerCase()) !== -1) {
                values.hours.forEach(hour => {
                    let eventDate = moment(beginDate).hour(hour.split(':')[0]).minute(hour.split(':')[1]);
                    generatedList.push({
                        eventDate: eventDate.format('YYYY-MM-DD HH:mm'),
                        annotation: '',
                        state: 'valid',
                        reportDate: '',
                        index: index.current,
                        eventDateUuid: uuidv4(),
                    });

                    index.current = index.current + 1;
                });
            }

            beginDate.add(1, 'day');
        }

        submitDateRange(generatedList);
        setOpen(null);
    };

    const generateSchema = Yup.object().shape({
        days: Yup.array().min(1, 'Veuillez renseigner au moins un jour.'),
        beginDate: Yup.date()
            .required('Veuillez renseigner la date de début.')
            .test('isValid', 'Date invalide', (val) => val && moment(val).isValid()),
        endDate: Yup.date()
            .required('Veuillez renseigner la date de fin')
            .test('isValid', 'Date invalide', (val) => val && moment(val).isValid())
            .when('beginDate', (beginDate, schema) => beginDate && schema.min(beginDate, 'La date de fin doit être supérieur à la date de début')),
        hours: Yup.array().min(1, 'Veuillez renseigner au moins une heure.'),
    });

    return (
        <Dialog maxWidth="sm" fullWidth open={open} onClose={() => setOpen(null)}>
            <Formik
                initialValues={{
                    days: [],
                    beginDate: moment().format('YYYY-MM-DD'),
                    endDate: '',
                    hours: [],
                }}
                validationSchema={generateSchema}
                onSubmit={(values, { setSubmitting }) => {
                    handleGenerateDate(values);
                    setSubmitting(false);
                }}
            >
                {({ values, errors, touched, setFieldTouched, setFieldValue, handleBlur, handleSubmit, isSubmitting }) => (
                    <Box component="form" onSubmit={handleSubmit}>
                        <DialogContent dividers padding={5}>
                            <Typography component="h1" variant="h4">
                                Générer des dates selon la règle:
                            </Typography>

                            <Box className="flex wrap align-center margin-top-5">
                                <Typography marginRight={5}>Tous les </Typography>

                                <FormControl className="max-width-100" fullWidth>
                                    <Select
                                        labelId={'days-choice-label'}
                                        variant={'standard'}
                                        size="small"
                                        value={values.days}
                                        onChange={(e) => setFieldValue('days', e.target.value)}
                                        onBlur={handleBlur}
                                        name="days"
                                        required
                                        multiple
                                        renderValue={() => values.days.join(', ')}
                                    >
                                        {DAY_LIST.map((item, dayIndex) => (
                                            <MenuItem key={dayIndex} value={item.value}>
                                                <Checkbox checked={values.days?.indexOf(item.value) > -1} />
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText error>{touched.days && errors.days}</FormHelperText>
                                </FormControl>

                                <Typography marginInline={5}> entre le </Typography>

                                <Component.CmtDatePicker
                                    fullWidth
                                    maxWidth={100}
                                    value={values.beginDate}
                                    setValue={(newValue) => {
                                        setFieldValue('beginDate', moment(newValue).format('YYYY-MM-DD'));
                                    }}
                                    name="beginDate"
                                    onTouched={setFieldTouched}
                                    required
                                    inputSize="small"
                                    error={touched.beginDate && errors.beginDate}
                                />

                                <Typography marginInline={5}> et le </Typography>

                                <Component.CmtDatePicker
                                    fullWidth
                                    maxWidth={100}
                                    value={values.endDate}
                                    setValue={(newValue) => {
                                        setFieldValue('endDate', moment(newValue).format('YYYY-MM-DD'));
                                    }}
                                    onTouched={setFieldTouched}
                                    name="endDate"
                                    required
                                    inputSize="small"
                                    error={touched.endDate && errors.endDate}
                                />

                                <Typography marginInline={5}> inclus à </Typography>

                                

                                
                            </Box>

                            <Box className="flex wrap align-center margin-top-5">
                            {values.hours.map((hour, index) => (
                                    <Box key={index} className="flex align-center margin-top-5"
                                    sx={{ position: 'relative', paddingLeft: '20px',}}>
                                        <Component.CmtTimePicker
                                            fullWidth
                                            maxWidth={50}
                                            value={hour}
                                            setValue={(newValue) => {
                                                const newHours = [...values.hours];
                                                newHours[index] = moment(newValue).format('HH:mm');
                                                setFieldValue('hours', newHours);
                                            }}
                                            name={`hours[${index}]`}
                                            onTouched={setFieldTouched}
                                            required
                                            inputSize="small"
                                            error={touched.hours && errors.hours}
                                        />
                                        <Component.DeleteBlockFabButton
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: '2px',      // Adjusts the button position
                                                right: '2px',    // Places button in top-right corner
                                                minWidth: '24px', // Smaller button size
                                                minHeight: '24px', 
                                                padding: '2px', 
                                            }}
                                            onClick={() => {
                                                const newHours = values.hours.filter((_, i) => i !== index);
                                                setFieldValue('hours', newHours);
                                            }}
                                        >
                                            <DeleteIcon fontSize="small"/>
                                        </Component.DeleteBlockFabButton>
                                            
                                    </Box>
                                ))}


                           
                            </Box>

                            <Box className="flex row-end">
                                <Button
                                    color="primary"
                                    onClick={() => {
                                        setFieldValue('hours', [...values.hours, moment().format('HH:mm')]);
                                    }}
                                >
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
};
