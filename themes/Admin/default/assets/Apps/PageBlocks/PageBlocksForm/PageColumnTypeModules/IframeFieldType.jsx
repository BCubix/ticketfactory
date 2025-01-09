import React from 'react';
import * as Yup from 'yup';

import { Component } from '@/AdminService/Component';
import { Box } from '@mui/material';

const LABEL = 'Iframe';
const TYPE = 'iframe';
const TYPE_GROUP_NAME = 'Contenu';

const FormComponent = ({ value, errors, touched, name, label, setFieldTouched, setFieldValue }) => (
    <Box className="margin-3">
        <Component.CmtTextField
            value={value || ''}
            label={label}
            onChange={(e) => {
                setFieldValue(name, e.target.value);
            }}
            onBlur={() => setFieldTouched(name, true, false)}
            name={name}
            error={touched && errors}
            type="url"
        />
    </Box>
);

const getSelectEntry = () => ({ name: TYPE, label: LABEL, type: TYPE, groupName: TYPE_GROUP_NAME });

const getValidation = () => {
    let validation = Yup.string();

    validation = validation.matches(/^(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/, 'Url invalide');

    return validation;
};

export default {
    TYPE,
    getSelectEntry,
    FormComponent,
    getValidation,
};
