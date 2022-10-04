import { Box, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { CmtTimePicker } from '../../../../Components/CmtTimePicker/CmtTimePicker';

const FormComponent = ({
    values,
    setFieldValue,
    setFieldTouched,
    name,
    errors,
    field,
    label,
    touched,
}) => {
    return (
        <Box sx={{ marginTop: 2 }}>
            <CmtTimePicker
                fullWidth
                value={values[field.name]}
                label={label}
                setValue={(newValue) => {
                    setFieldValue(name, moment(newValue).format('HH:mm'));
                }}
                onTouched={setFieldTouched}
                name={name}
                error={touched && touched[field.name] && errors && errors[field.name]}
                required={field?.options?.required}
                disabled={field?.options?.disabled}
                inputSize="small"
            />
            {field.helper && (
                <Typography component="p" variant="body2" sx={{ fontSize: 10, marginTop: 2 }}>
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
    FormComponent,
    getInitialValue,
};
