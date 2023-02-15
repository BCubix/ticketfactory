import React from 'react';
import { CirclePicker } from 'react-color';
import { InputLabel, Typography } from '@mui/material';
import { Box } from '@mui/system';

const TYPE = 'color';

const VALIDATION_TYPE = 'date';
const VALIDATION_LIST = [
    {
        name: 'required',
        validationName: 'required',
        test: (value) => Boolean(value),
        params: ({ name }) => [`Veuillez renseigner le champ ${name}`],
    },
];

const FormComponent = ({ values, setFieldValue, handleBlur, name, errors, field, label, touched }) => {
    return (
        <Box sx={{ marginBlock: 3 }}>
            <InputLabel id={`${label}-label`}>{label}</InputLabel>
            <CirclePicker
                width="100%"
                value={values[field.name]}
                onChange={(newValue) => setFieldValue(name, newValue.hex)}
                label={label}
                onBlur={handleBlur}
                name={name}
                error={touched && touched[field.name] && errors && errors[field.name]}
                circleSpacing={8}
                required={field?.options?.required}
                disabled={field?.options?.disabled}
            />
            {field.helper && (
                <Typography component="p" variant="body2" sx={{ fontSize: 10, marginTop: 3 }}>
                    {field.helper}
                </Typography>
            )}
        </Box>
    );
};

const getInitialValue = () => {
    return '';
};

export default {
    TYPE,
    FormComponent,
    getInitialValue,
    VALIDATION_LIST,
    VALIDATION_TYPE,
};
