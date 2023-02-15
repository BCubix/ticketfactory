import React from 'react';
import { Typography } from '@mui/material';
import { Component } from '@/AdminService/Component';

const TYPE = 'number';

const VALIDATION_TYPE = 'number';
const VALIDATION_LIST = [
    {
        name: 'required',
        validationName: 'required',
        test: (value) => Boolean(value),
        params: ({ name }) => [`Veuillez renseigner le champ ${name}`],
    },

    {
        name: 'min',
        validationName: 'min',
        test: (value) => Boolean(value),
        params: ({ name, value }) => [value, `Le champ ${name} doit être supérieur ou égal à ${value}`],
    },

    {
        name: 'max',
        validationName: 'max',
        test: (value) => Boolean(value),
        params: ({ name, value }) => [value, `Le champ ${name} doit être inférieur ou égal à ${value}`],
    },
];

const FormComponent = ({ values, handleChange, handleBlur, name, errors, field, label, touched }) => {
    return (
        <>
            <Component.CmtTextField
                value={values[field.name]}
                label={label}
                onChange={handleChange}
                onBlur={handleBlur}
                name={name}
                error={touched && touched[field.name] && errors && errors[field.name]}
                required={field?.options?.required}
                disabled={field?.options?.disabled}
                type="number"
            />
            {field.helper && (
                <Typography component="p" variant="body2" sx={{ fontSize: 10 }}>
                    {field.helper}
                </Typography>
            )}
        </>
    );
};

const getInitialValue = () => {
    return '';
};

export default {
    TYPE,
    FormComponent,
    getInitialValue,
    VALIDATION_TYPE,
    VALIDATION_LIST,
};
