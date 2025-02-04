import React from 'react';
import moment from 'moment/moment';
import * as Yup from 'yup';

import { Box } from '@mui/material';
import { Component } from '@/AdminService/Component';

const LABEL = 'Date / Heure';
const TYPE = 'datetime';
const TYPE_GROUP_NAME = 'Champs de base';

const FormComponent = ({ value, errors, touched, name, label, setFieldTouched, setFieldValue }) => (
    <Box className="margin-3">
        <Component.CmtDateTimePicker
            fullWidth
            value={value}
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
            error={touched && errors}
            inputSize="small"
        />
    </Box>
);

const getSelectEntry = () => ({ name: TYPE, label: LABEL, type: TYPE, groupName: TYPE_GROUP_NAME });

const getValidation = () => {
    let validation = Yup.date();

    validation = validation.test('isValid', 'Date invalide', (val) => val && moment(val).isValid());

    return validation;
};

export default {
    TYPE,
    getSelectEntry,
    FormComponent,
    getValidation,
};
