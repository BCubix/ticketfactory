import React from 'react';
import * as Yup from 'yup';

import { Component } from '@/AdminService/Component';
import { Box } from '@mui/material';

const LABEL = 'Email';
const TYPE = 'email';
const TYPE_GROUP_NAME = 'Champs de base';

const FormComponent = ({ value, errors, touched, name, label, setFieldTouched, setFieldValue }) => (
    <Box className="margin-3">
        <Component.CmtTextField
            value={value}
            label={label}
            onChange={(e) => {
                setFieldValue(name, e.target.value);
            }}
            onBlur={() => setFieldTouched(name, true, false)}
            name={name}
            error={touched && errors}
            type="email"
        />
    </Box>
);

const getSelectEntry = () => ({ name: TYPE, label: LABEL, type: TYPE, groupName: TYPE_GROUP_NAME });

const getValidation = () => {
    return Yup.string().email('Email invalide');
};

export default {
    TYPE,
    getSelectEntry,
    FormComponent,
    getValidation,
};
