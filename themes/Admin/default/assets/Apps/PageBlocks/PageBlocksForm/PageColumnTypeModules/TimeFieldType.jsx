import React from 'react';
import moment from 'moment/moment';
import * as Yup from 'yup';

import { Box } from '@mui/material';
import { Component } from '@/AdminService/Component';

const LABEL = 'Heure';
const TYPE = 'time';
const TYPE_GROUP_NAME = 'Champs de base';

const FormComponent = ({ value, errors, touched, name, label, setFieldTouched, setFieldValue }) => (
    <Box className="margin-3">
        <Component.CmtTimePicker
            fullWidth
            value={value}
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
            error={touched && errors}
            inputSize="small"
        />
    </Box>
);

const getSelectEntry = () => ({ name: TYPE, label: LABEL, type: TYPE, groupName: TYPE_GROUP_NAME });

const getValidation = () => {
    let validation = Yup.string();

    validation = validation.test('isValid', 'Date invalide', (val) => val && moment(val, 'HH:mm').isValid());

    return validation;
};

export default {
    TYPE,
    getSelectEntry,
    FormComponent,
    getValidation,
};
