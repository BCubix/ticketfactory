import React from 'react';
import moment from 'moment';
import * as Yup from 'yup';
import { Box, Typography } from '@mui/material';
import { Component } from '@/AdminService/Component';

const TYPE = 'datetime';

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
            <Component.CmtDateTimePicker
                fullWidth
                value={values[field.name]}
                label={label}
                setValue={(newValue) => {
                    if (!newValue) {
                        setFieldValue(name, '');
                        return;
                    }
                    setFieldValue(name, moment(newValue).format('YYYY-MM-DD HH:mm'));
                }}
                onTouched={setFieldTouched}
                name={name}
                error={touched && touched[field.name] && errors && errors[field.name]}
                required={field?.options?.required}
                disabled={field?.options?.disabled}
                disablePast={field?.validations?.disablePast}
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
    let validation = Yup.date();

    const valList = { ...contentType.validations, ...contentType.options };

    VALIDATION_LIST?.forEach((element) => {
        const elVal = valList[element.name];
        if (elVal && element.test(elVal.value)) {
            validation = validation[element.validationName](...element.params({ name: contentType.title, value: elVal.value }));
        }
    });

    // Add test to validation to check if date is valid
    validation = validation.test('isValid', 'Date invalide', (val) => val && moment(val).isValid());

    const minDate = valList['minDate'];
    const disablePast = valList['disablePast'];
    let validMinDate = '';
    let validMinDateMessage = '';

    /**
     *  We check if the minDate exist and defined and is after today date or disablePast doesn't exist or is false.
     *  Or if disablePast exist and defined.
     **/
    if (minDate && minDate.value && (moment().isBefore(moment(minDate.value)) || !disablePast || !disablePast?.value)) {
        validMinDate = moment(minDate.value);
        validMinDateMessage = `La date doit être supérieur ou égal à ${validMinDate.format('DD-MM-YYYY')}`;
    } else if (disablePast && disablePast.value) {
        validMinDate = moment();
        validMinDateMessage = `La date doit doit être supérieur ou égal à aujourd'hui`;
    }

    /**
     *  We are sure that either the minDate or the disablePast is defined.
     *  Then we add to validation a test for the minimum date.
     **/
    if (validMinDate) {
        validation = validation.test('minDate', validMinDateMessage, (val) => val && moment(val).isSameOrAfter(validMinDate, 'day'));
    }

    // We get the maxDate validation data and add a test to validation to check maximum Date if maxDate.value exist and is defined
    const maxDate = valList['maxDate'];
    if (maxDate && maxDate.value) {
        validation = validation.test(
            'maxDate',
            `La date doit être inférieur ou égal à ${moment(maxDate.value).format('DD-MM-YYYY')}`,
            (val) => val && moment(val).isSameOrBefore(moment(maxDate.value), 'day')
        );
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
