import { Typography } from '@mui/material';
import React from 'react';
import { CmtTextField } from '../../../../Components/CmtTextField/CmtTextField';

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
            <CmtTextField
                value={values[field.name]}
                label={label}
                onChange={handleChange}
                onBlur={handleBlur}
                name={name}
                error={touched && touched[field.name] && errors && errors[field.name]}
                required={field?.options?.required}
                disabled={field?.options?.disabled}
                type="url"
            />
            {field.instructions && (
                <Typography component="p" variant="body2" sx={{ fontSize: 10 }}>
                    {field.instructions}
                </Typography>
            )}
        </>
    );
};

const getInitialValue = () => {
    return '';
};

export default {
    FormComponent,
    getInitialValue,
};
