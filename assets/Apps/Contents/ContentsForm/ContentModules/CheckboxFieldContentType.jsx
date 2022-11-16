import React from 'react';
import { Checkbox, FormControl, FormControlLabel, FormHelperText, Typography } from '@mui/material';
import { Box } from '@mui/system';

const VALIDATION_TYPE = 'bool';
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
            <FormControl fullWidth>
                <FormControlLabel
                    size="small"
                    id={`choice-${name}`}
                    value={values[field.name]}
                    onChange={(e) => {
                        setFieldValue(name, e.target.checked);
                    }}
                    onBlur={handleBlur}
                    label={label}
                    labelPlacement="start"
                    control={<Checkbox />}
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginLeft: 0,
                        marginBlock: 0,
                    }}
                />
                {touched && touched[field.name] && errors && errors[field.name] && (
                    <FormHelperText error>{errors[field.name]}</FormHelperText>
                )}
            </FormControl>
            {field.helper && (
                <Typography component="p" variant="body2" sx={{ fontSize: 10, marginTop: 0 }}>
                    {field.helper}
                </Typography>
            )}
        </Box>
    );
};

const getInitialValue = () => {
    return false;
};

export default {
    FormComponent,
    getInitialValue,
    VALIDATION_LIST,
    VALIDATION_TYPE,
};
