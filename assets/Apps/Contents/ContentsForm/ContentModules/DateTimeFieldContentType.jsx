import { Box, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { CmtDateTimePicker } from '../../../../Components/CmtDateTimePicker/CmtDateTimePicker';

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
            <CmtDateTimePicker
                fullWidth
                value={values[field.name]}
                label={label}
                setValue={(newValue) => {
                    setFieldValue(name, moment(newValue).format('YYYY-MM-DD HH:mm'));
                }}
                onTouched={setFieldTouched}
                name={name}
                error={touched && touched[field.name] && errors && errors[field.name]}
                required={field?.options?.required}
                disabled={field?.options?.disabled}
                disablePast={field?.validations?.disablePast}
                inputSize="small"
            />
            {field.instructions && (
                <Typography component="p" variant="body2" sx={{ fontSize: 10, marginTop: 2 }}>
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
