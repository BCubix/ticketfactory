import React from 'react';
import * as Yup from 'yup';
import { Typography } from '@mui/material';
import { Component } from '@/AdminService/Component';

const TYPE = 'password';

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
                type="password"
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

const getValidation = (contentType) => {
    let validation = Yup[VALIDATION_TYPE]();

    const valList = { ...contentType.validations, ...contentType.options };

    VALIDATION_LIST?.forEach((element) => {
        const elVal = valList[element.name];
        if (elVal && element.test(elVal.value)) {
            validation = validation[element.validationName](...element.params({ name: contentType.title, value: elVal.value }));
        }
    });

    // We get minChar validation and check if defined, then add to validation the test to check if there is minChar
    const minChar = valList['minChar'];
    if (minChar && minChar.value) {
        validation = validation.test('minChar', 'Le mot de passe doit contenir au moins un caractère minuscule.', (val) => val && /^(?=.*[a-z])/.test(val));
    }

    // We get majChar validation and check if defined, then add to validation the test to check if there is majChar
    const majChar = valList['majChar'];
    if (majChar && majChar.value) {
        validation = validation.test('majChar', 'Le mot de passe doit contenir au moins un caractère majuscule.', (val) => val && /^(?=.*[A-Z])/.test(val));
    }

    // We get numberChar validation and check if defined, then add to validation the test to check if there is numberChar
    const numberChar = valList['numberChar'];
    if (numberChar && numberChar.value) {
        validation = validation.test('numberChar', 'Le mot de passe doit contenir au moins un nombre', (val) => val && /^(?=.*\d)/.test(val));
    }

    return validation;
};

export default {
    TYPE,
    FormComponent,
    getInitialValue,
    VALIDATION_TYPE,
    VALIDATION_LIST,
    getValidation,
};
