import React from 'react';

import { Box } from '@mui/material';
import { Component } from '@/AdminService/Component';

const LABEL = 'Texte';
const TYPE = 'text';
const TYPE_GROUP_NAME = 'Champs de base';

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
        />
    </Box>
);

const getSelectEntry = () => ({ name: TYPE, label: LABEL, type: TYPE, groupName: TYPE_GROUP_NAME });

export default {
    TYPE,
    getSelectEntry,
    FormComponent,
};
