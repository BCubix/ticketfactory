import React from 'react';
import moment from 'moment';
import * as Yup from 'yup';

import { Box, Typography } from '@mui/material';

import { Component } from '@/AdminService/Component';

const TYPE = 'time';

const VALIDATION_TYPE = 'date';
const VALIDATION_LIST = [
    {
        name: 'required',
        validationName: 'required',
        test: (value) => Boolean(value),
        params: ({ name }) => [`Veuillez renseigner le champ ${name}`],
    },
];

const FormComponent = ({ values, setFieldValue, setFieldTouched, name, errors, field, label, touched }) => {
    return (
        <Box sx={{ marginTop: 2 }}>
            <Component.CmtTimePicker
                fullWidth
                value={values[field.name]}
                label={label}
                setValue={(newValue) => {
                    if (!newValue) {
                        setFieldValue(name, '');
                        return;
                    }
                    setFieldValue(name, moment(newValue).format('HH:mm'));
                }}
                onTouched={setFieldTouched}
                name={name}
                error={touched && touched[field.name] && errors && errors[field.name]}
                required={field?.options?.required}
                disabled={field?.options?.disabled}
                inputSize="small"
            />
            {field.helper && (
                <Typography component="p" variant="body2" sx={{ fontSize: 10, marginTop: 2 }}>
                    {field.helper}
                </Typography>
            )}
        </Box>
    );
};

const getInitialValue = () => {
    return '';
};

const getValidation = (contentType) => {
    let validation = Yup.string();

    const valList = { ...contentType.validations, ...contentType.options };

    VALIDATION_LIST?.forEach((element) => {
        const elVal = valList[element.name];
        if (elVal && element.test(elVal.value)) {
            validation = validation[element.validationName](...element.params({ name: contentType.title, value: elVal.value }));
        }
    });

    // Add test to validation to check if time is valid
    validation = validation.test('isValid', 'Date invalide', (val) => val && moment(val, 'HH:mm').isValid());

    // We get the minHour validation data and add a test to validation to check minimum Hour if minHour.value exist and is defined
    const minHour = valList['minDate'];
    valList['minHour'];
    if (minHour && minHour.value) {
        validation = validation.test('minHour', `L'heure doit être supérieur ou égal à ${moment(minHour.value, 'HH:mm').format('HH:mm')}`, (val) => {
            const valHour = moment(val, 'HH:mm').format('HH:mm');

            return val && moment(valHour, 'HH:mm').isSameOrAfter(moment(minHour.value, 'HH:mm'));
        });
    }

    // We get the maxHour validation data and add a test to validation to check maximum Hour if maxHour.value exist and is defined
    const maxHour = valList['maxHour'];
    if (maxHour && maxHour.value) {
        validation = validation.test('maxHour', `L'heure doit être inférieur ou égal à ${moment(maxHour.value, 'HH:mm').format('HH:mm')}`, (val) => {
            const valHour = moment(val, 'HH:mm').format('HH:mm');

            return val && moment(valHour, 'HH:mm').isSameOrBefore(moment(maxHour.value, 'HH:mm'));
        });
    }

    return validation;
};

export default {
    TYPE,
    FormComponent,
    getInitialValue,
    VALIDATION_LIST,
    VALIDATION_TYPE,
    getValidation,
};
