import { FormControl, FormControlLabel, FormHelperText, Switch, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

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
                    control={<Switch />}
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
                <Typography component="p" variant="body2" sx={{ fontSize: 10 }}>
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
};
