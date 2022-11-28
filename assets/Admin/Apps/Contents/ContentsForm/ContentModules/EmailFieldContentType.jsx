import React from 'react';
import * as Yup from 'yup';
import { Typography } from '@mui/material';
import { Component } from "@/AdminService/Component";

const VALIDATION_LIST = [
    {
        name: 'required',
        validationName: 'required',
        test: (value) => Boolean(value),
        params: ({ name }) => [`Veuillez renseigner le champ ${name}`],
    },
];

const FormComponent = ({
    values,
    handleChange,
    handleBlur,
    name,
    errors,
    field,
    label,
    touched,
}) => {
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
                type="email"
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
    let validation = Yup.string().email('Email invalide');

    const valList = [...contentType.validations, ...contentType.options];

    VALIDATION_LIST?.forEach((element) => {
        const elVal = valList.find((el) => el.name === element.name);
        if (elVal && element.test(elVal.value)) {
            validation = validation[element.validationName](
                ...element.params({ name: contentType.title, value: elVal.value })
            );
        }
    });

    return validation;
};

export default {
    FormComponent,
    getInitialValue,
    VALIDATION_LIST,
    getValidation,
};
