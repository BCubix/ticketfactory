import React from 'react';
import { Typography } from '@mui/material';
import { Component } from '@/AdminService/Component';

const TYPE = 'text';

const VALIDATION_TYPE = 'string';
const VALIDATION_LIST = [
    {
        name: 'required',
        validationName: 'required',
        test: (value) => Boolean(value),
        params: ({ name }) => [`Veuillez renseigner le champ ${name}`],
    },

    {
        name: 'minLength',
        validationName: 'min',
        test: (value) => Boolean(value),
        params: ({ name, value }) => [value, `Le champ ${name} doit faire au moins ${value} caractère${value > 1 ? 's' : ''}`],
    },

    {
        name: 'maxLength',
        validationName: 'max',
        test: (value) => Boolean(value),
        params: ({ name, value }) => [value, `Le champ ${name} doit faire moins de ${value} caractère${value > 1 ? 's' : ''}`],
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
