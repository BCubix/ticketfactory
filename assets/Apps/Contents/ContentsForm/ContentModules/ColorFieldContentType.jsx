import { FormControl, InputLabel, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { CirclePicker } from 'react-color';

const FormComponent = ({
    values,
    setFieldValue,
    handleBlur,
    name,
    errors,
    field,
    label,
    touched,
}) => {
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
            {field.instructions && (
                <Typography component="p" variant="body2" sx={{ fontSize: 10, marginTop: 3 }}>
                    {field.instructions}
                </Typography>
            )}
        </Box>
    );
};

const getInitialValue = () => {
    return '';
};

export default {
    FormComponent,
    getInitialValue,
};
